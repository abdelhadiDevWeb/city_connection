import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import {
  ResidentProfileModel,
  ApartmentModel,
  PaymentModel,
  IncidentModel,
  AnnouncementModel,
} from '@saas/database';
import { ReportIncidentSchema } from '@saas/validation';

export const residentRoutes = new Elysia({ prefix: '/api/v1/resident' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // Resident profile & apartment overview
  .get('/overview', async ({ authUser, set }) => {
    const resident: any = await ResidentProfileModel.findOne({
      $or: [{ userId: authUser.userId }, { phone: (authUser as any).phone || '' }],
    })
      .populate('residenceId', 'name wilaya commune address')
      .populate('buildingId', 'name')
      .populate('apartmentId', 'number floor currentBalance monthlyChargeAmount')
      .lean();

    if (!resident) {
      // Mock / fallback profile for demonstration if not linked yet
      return {
        success: true,
        data: {
          fullName: 'Résident Connecté',
          residenceName: 'Cité 1500 Logements AADL',
          buildingName: 'Bâtiment B12',
          apartmentNumber: 'Apt 14',
          floor: 3,
          currentBalance: -4000, // 2 months unpaid example
          monthlyCharge: 2000,
          unpaidMonths: 2,
          isUpToDate: false,
        },
      };
    }

    const apt = resident.apartmentId || {};
    const bal = Number(apt.currentBalance) || 0;
    const monthly = Number(apt.monthlyChargeAmount) || 2000;

    return {
      success: true,
      data: {
        id: resident._id.toString(),
        fullName: resident.fullName,
        phone: resident.phone,
        residentType: resident.residentType,
        residenceId: resident.residenceId?._id?.toString(),
        residenceName: resident.residenceId?.name || 'Résidence',
        buildingName: resident.buildingId?.name || 'Bloc A',
        apartmentNumber: apt.number || '01',
        floor: apt.floor || 0,
        currentBalance: bal,
        monthlyCharge: monthly,
        isUpToDate: bal >= 0,
        unpaidMonths: bal < 0 ? Math.ceil(Math.abs(bal) / monthly) : 0,
      },
    };
  })

  // Payment history for resident
  .get('/payments', async ({ authUser }) => {
    const payments: any[] = await PaymentModel.find({
      $or: [{ collectedByUserId: authUser.userId }],
    })
      .sort({ paymentDate: -1 })
      .limit(20)
      .lean();

    return {
      success: true,
      data: payments.map((p) => ({
        id: p._id.toString(),
        receiptNumber: p.receiptNumber,
        period: p.period,
        amount: p.amount,
        paymentDate: p.paymentDate,
        paymentMethod: p.paymentMethod,
        status: p.status,
      })),
    };
  })

  // Report incident from mobile app
  .post('/incidents', async ({ authUser, body, set }) => {
    const parsed = ReportIncidentSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const incident = await IncidentModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      reporterName: authUser.email,
      status: 'REPORTED',
    });

    return {
      success: true,
      data: {
        id: incident._id.toString(),
        title: incident.title,
        status: incident.status,
        message: 'Votre signalement a été transmis au syndic avec succès',
      },
    };
  })

  // Resident announcements
  .get('/announcements', async ({ authUser, query }) => {
    const announcements = await AnnouncementModel.find({
      expiresAt: { $not: { $lt: new Date() } },
    })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    return {
      success: true,
      data: announcements.map((a: any) => ({
        id: a._id.toString(),
        title: a.title,
        content: a.content,
        category: a.category,
        priority: a.priority,
        publishedAt: a.publishedAt,
      })),
    };
  });
