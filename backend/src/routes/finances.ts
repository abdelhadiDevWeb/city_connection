import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import {
  ChargeDefinitionModel,
  PaymentModel,
  ExpenseModel,
  BillModel,
  ApartmentModel,
  ResidentProfileModel,
} from '@saas/database';
import {
  CreateChargeDefinitionSchema,
  RecordPaymentSchema,
  CreateExpenseSchema,
  CreateBillSchema,
} from '@saas/validation';

export const financeRoutes = new Elysia({ prefix: '/api/v1/finances' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // ----------------------------------------------------
  // CHARGES
  // ----------------------------------------------------

  // List charge definitions
  .get('/charges', async ({ authUser, query }) => {
    const filter: any = { organizationId: authUser.activeOrgId, status: 'ACTIVE' };
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const charges = await ChargeDefinitionModel.find(filter).lean();
    return {
      success: true,
      data: charges.map((c: any) => ({
        id: c._id.toString(),
        residenceId: c.residenceId.toString(),
        title: c.title,
        categoryName: c.categoryName,
        amount: c.amount,
        frequency: c.frequency,
        appliesTo: c.appliesTo,
        dueDay: c.dueDay,
        status: c.status,
      })),
    };
  })

  // Create charge definition
  .post('/charges', async ({ authUser, body, set }) => {
    const parsed = CreateChargeDefinitionSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const charge = await ChargeDefinitionModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'ACTIVE',
    });

    return {
      success: true,
      data: {
        id: charge._id.toString(),
        title: charge.title,
        amount: charge.amount,
      },
    };
  })

  // Trigger monthly charge generation (debits all occupied apartments)
  .post('/charges/generate-monthly', async ({ authUser, body, set }) => {
    const { residenceId, period } = (body as { residenceId: string; period?: string }) || {};
    if (!residenceId) {
      set.status = 400;
      return { success: false, error: { code: 'BAD_REQUEST', message: 'residenceId is required' } };
    }

    const currentPeriod = period || new Date().toISOString().substring(0, 7); // e.g. "2026-03"

    // Fetch all occupied apartments in the residence
    const apartments = await ApartmentModel.find({
      residenceId,
      occupancyStatus: 'OCCUPIED',
    });

    let debitedCount = 0;
    let totalDebitedAmount = 0;

    for (const apt of apartments) {
      const chargeAmount = Number(apt.monthlyChargeAmount) || 2000;
      // Deduct charge from current balance (negative balance = unpaid debt)
      apt.currentBalance = (Number(apt.currentBalance) || 0) - chargeAmount;
      await apt.save();

      debitedCount++;
      totalDebitedAmount += chargeAmount;
    }

    return {
      success: true,
      data: {
        period: currentPeriod,
        apartmentsDebited: debitedCount,
        totalDebitedAmount,
        message: `Successfully generated ${currentPeriod} charges for ${debitedCount} apartments`,
      },
    };
  })

  // ----------------------------------------------------
  // PAYMENTS
  // ----------------------------------------------------

  // List payments
  .get('/payments', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;
    if (query?.period) filter.period = query.period;

    const payments: any[] = await PaymentModel.find(filter)
      .populate('apartmentId', 'number')
      .populate('residentId', 'fullName phone')
      .sort({ paymentDate: -1 })
      .limit(100)
      .lean();

    return {
      success: true,
      data: payments.map((p) => ({
        id: p._id.toString(),
        residenceId: p.residenceId.toString(),
        apartmentId: p.apartmentId?._id?.toString(),
        apartmentNumber: p.apartmentId?.number || 'N/A',
        residentName: p.residentId?.fullName || 'Occupant',
        residentPhone: p.residentId?.phone,
        period: p.period,
        amount: p.amount,
        paymentDate: p.paymentDate,
        paymentMethod: p.paymentMethod,
        receiptNumber: p.receiptNumber,
        status: p.status,
        notes: p.notes,
      })),
    };
  })

  // Record resident payment (credits apartment balance)
  .post('/payments', async ({ authUser, body, set }) => {
    const parsed = RecordPaymentSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const data = parsed.data;

    // Generate unique receipt serial number
    const count = await PaymentModel.countDocuments({ residenceId: data.residenceId });
    const year = new Date().getFullYear();
    const receiptNumber = `REC-${year}-${String(count + 1).padStart(5, '0')}`;

    const payment = await PaymentModel.create({
      organizationId: authUser.activeOrgId,
      residenceId: data.residenceId,
      apartmentId: data.apartmentId,
      residentId: data.residentId,
      period: data.period,
      amount: data.amount,
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      receiptNumber,
      proofDocumentUrl: data.proofDocumentUrl,
      notes: data.notes,
      status: 'VALIDATED',
      collectedByUserId: authUser.userId,
    });

    // Credit apartment balance
    await ApartmentModel.findByIdAndUpdate(data.apartmentId, {
      $inc: { currentBalance: data.amount },
    });

    return {
      success: true,
      data: {
        id: payment._id.toString(),
        receiptNumber: payment.receiptNumber,
        amount: payment.amount,
        period: payment.period,
        paymentDate: payment.paymentDate,
      },
    };
  })

  // ----------------------------------------------------
  // UNPAID RECOVERY AGGREGATOR
  // ----------------------------------------------------

  // Get ranked list of apartments with unpaid charges
  .get('/unpaid', async ({ query }) => {
    const residenceId = query?.residenceId;
    if (!residenceId) {
      return { success: false, error: { code: 'BAD_REQUEST', message: 'residenceId is required' } };
    }

    // Find apartments where currentBalance < 0
    const unpaidApartments: any[] = await ApartmentModel.find({
      residenceId,
      currentBalance: { $lt: 0 },
    })
      .populate('buildingId', 'name')
      .populate('currentResidentId', 'fullName phone')
      .sort({ currentBalance: 1 }) // most negative first
      .lean();

    const data = unpaidApartments.map((a) => {
      const debt = Math.abs(Number(a.currentBalance) || 0);
      const monthly = Number(a.monthlyChargeAmount) || 2000;
      const unpaidMonths = Math.max(1, Math.ceil(debt / monthly));

      return {
        apartmentId: a._id.toString(),
        apartmentNumber: a.number,
        buildingId: a.buildingId?._id?.toString(),
        buildingName: a.buildingId?.name || 'Bloc A',
        residentName: a.currentResidentId?.fullName || 'Non assigné',
        residentPhone: a.currentResidentId?.phone || 'N/A',
        monthlyCharge: monthly,
        unpaidMonthsCount: unpaidMonths,
        totalDueAmount: debt,
        status: unpaidMonths >= 3 ? 'CRITICAL' : 'WARNING',
      };
    });

    return {
      success: true,
      data,
    };
  })

  // ----------------------------------------------------
  // EXPENSES
  // ----------------------------------------------------

  // List operational expenses
  .get('/expenses', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const expenses: any[] = await ExpenseModel.find(filter)
      .populate('buildingId', 'name')
      .sort({ expenseDate: -1 })
      .lean();

    return {
      success: true,
      data: expenses.map((e) => ({
        id: e._id.toString(),
        residenceId: e.residenceId.toString(),
        buildingName: e.buildingId?.name || 'Toute la résidence',
        category: e.category,
        amount: e.amount,
        expenseDate: e.expenseDate,
        supplierName: e.supplierName,
        supplierPhone: e.supplierPhone,
        paymentMethod: e.paymentMethod,
        receiptUrl: e.receiptUrl,
        description: e.description,
        status: e.status,
      })),
    };
  })

  // Record operational expense
  .post('/expenses', async ({ authUser, body, set }) => {
    const parsed = CreateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const expense = await ExpenseModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'PAID',
    });

    return {
      success: true,
      data: {
        id: expense._id.toString(),
        category: expense.category,
        amount: expense.amount,
      },
    };
  })

  // ----------------------------------------------------
  // BILLS (Utility & Service Contracts)
  // ----------------------------------------------------

  // List bills
  .get('/bills', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const bills: any[] = await BillModel.find(filter).sort({ dueDate: 1 }).lean();

    return {
      success: true,
      data: bills.map((b) => ({
        id: b._id.toString(),
        residenceId: b.residenceId.toString(),
        serviceType: b.serviceType,
        providerName: b.providerName,
        referenceNumber: b.referenceNumber,
        billingPeriod: b.billingPeriod,
        amount: b.amount,
        dueDate: b.dueDate,
        paymentDate: b.paymentDate,
        status: b.status,
        notes: b.notes,
      })),
    };
  })

  // Add bill
  .post('/bills', async ({ authUser, body, set }) => {
    const parsed = CreateBillSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const bill = await BillModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'UNPAID',
    });

    return {
      success: true,
      data: {
        id: bill._id.toString(),
        providerName: bill.providerName,
        amount: bill.amount,
        dueDate: bill.dueDate,
      },
    };
  })

  // Mark bill as paid
  .patch('/bills/:id/pay', async ({ params, set }) => {
    const bill = await BillModel.findByIdAndUpdate(
      params.id,
      { status: 'PAID', paymentDate: new Date() },
      { new: true }
    );

    if (!bill) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Bill not found' } };
    }

    return {
      success: true,
      data: {
        id: bill._id.toString(),
        status: bill.status,
        paymentDate: bill.paymentDate,
      },
    };
  });
