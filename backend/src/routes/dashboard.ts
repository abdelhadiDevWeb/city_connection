import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import {
  ResidenceModel,
  BuildingModel,
  ApartmentModel,
  PaymentModel,
  ExpenseModel,
  BillModel,
  EquipmentModel,
  IncidentModel,
  InterventionModel,
  TaskModel,
} from '@saas/database';

export const dashboardRoutes = new Elysia({ prefix: '/api/v1/dashboard' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  .get('/metrics', async ({ authUser, query }) => {
    const orgId = authUser.activeOrgId;
    const residenceId = query?.residenceId;

    const baseFilter: any = {};
    if (orgId) baseFilter.organizationId = orgId;
    if (residenceId) baseFilter.residenceId = residenceId;

    const currentPeriod = new Date().toISOString().substring(0, 7); // e.g. "2026-03"

    const [
      residencesCount,
      buildings,
      apartments,
      paymentsThisMonth,
      expensesThisMonth,
      overdueBills,
      openInterventions,
      criticalIncidents,
      outOfServiceEquipment,
      overdueTasks,
      recentPayments,
      recentIncidents,
    ] = await Promise.all([
      ResidenceModel.countDocuments(orgId ? { organizationId: orgId, status: 'ACTIVE' } : { status: 'ACTIVE' }),
      BuildingModel.find(baseFilter).lean(),
      ApartmentModel.find(baseFilter).lean(),
      PaymentModel.find({ ...baseFilter, period: currentPeriod, status: 'VALIDATED' }).lean(),
      ExpenseModel.find(baseFilter).limit(50).lean(),
      BillModel.find({ ...baseFilter, status: 'UNPAID', dueDate: { $lt: new Date() } }).lean(),
      InterventionModel.find({ ...baseFilter, status: { $in: ['NEW', 'ASSIGNED', 'IN_PROGRESS'] } }).lean(),
      IncidentModel.find({ ...baseFilter, priority: { $in: ['HIGH', 'CRITICAL'] }, status: { $ne: 'CLOSED' } }).lean(),
      EquipmentModel.find({ ...baseFilter, status: { $in: ['OUT_OF_SERVICE', 'DEGRADED'] } }).lean(),
      TaskModel.find({ ...baseFilter, status: 'PENDING', deadline: { $lt: new Date() } }).lean(),
      PaymentModel.find(baseFilter).sort({ paymentDate: -1 }).limit(5).populate('apartmentId', 'number').lean(),
      IncidentModel.find(baseFilter).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalApartments = apartments.length;
    const occupiedApartments = apartments.filter((a: any) => a.occupancyStatus === 'OCCUPIED').length;
    const vacantApartments = totalApartments - occupiedApartments;
    const occupancyRate = totalApartments > 0 ? Math.round((occupiedApartments / totalApartments) * 100) : 0;

    // Financial KPIs
    const expectedCharges = apartments
      .filter((a: any) => a.occupancyStatus === 'OCCUPIED')
      .reduce((sum: number, a: any) => sum + (Number(a.monthlyChargeAmount) || 2000), 0);

    const collectedCharges = paymentsThisMonth.reduce(
      (sum: number, p: any) => sum + (Number(p.amount) || 0),
      0
    );

    const totalOutstandingDebt = apartments.reduce((sum: number, a: any) => {
      const bal = Number(a.currentBalance) || 0;
      return bal < 0 ? sum + Math.abs(bal) : sum;
    }, 0);

    const unpaidThisMonth = Math.max(0, expectedCharges - collectedCharges);
    const collectionRate = expectedCharges > 0 ? Math.round((collectedCharges / expectedCharges) * 100) : 0;

    const monthlyExpenses = expensesThisMonth.reduce(
      (sum: number, e: any) => sum + (Number(e.amount) || 0),
      0
    );

    // Unpaid apartments count
    const unpaidApartmentsCount = apartments.filter((a: any) => (Number(a.currentBalance) || 0) < 0).length;

    // Buildings breakdown performance
    const buildingsPerformance = buildings.map((b: any) => {
      const bApts = apartments.filter((a: any) => String(a.buildingId) === String(b._id));
      const bOccupied = bApts.filter((a: any) => a.occupancyStatus === 'OCCUPIED').length;
      const bExpected = bApts
        .filter((a: any) => a.occupancyStatus === 'OCCUPIED')
        .reduce((sum: number, a: any) => sum + (Number(a.monthlyChargeAmount) || 2000), 0);

      const bAptIds = bApts.map((a: any) => String(a._id));
      const bCollected = paymentsThisMonth
        .filter((p: any) => bAptIds.includes(String(p.apartmentId)))
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

      const bUnpaid = bApts.reduce((sum: number, a: any) => {
        const bal = Number(a.currentBalance) || 0;
        return bal < 0 ? sum + Math.abs(bal) : sum;
      }, 0);

      const bRate = bExpected > 0 ? Math.round((bCollected / bExpected) * 100) : 0;

      return {
        id: b._id.toString(),
        name: b.name,
        totalApartments: bApts.length,
        occupiedCount: bOccupied,
        collectionRate: bRate,
        unpaidAmount: bUnpaid,
        openIssuesCount: criticalIncidents.filter((i: any) => String(i.buildingId) === String(b._id)).length,
      };
    });

    // Recent activity list
    const recentActivity = [
      ...recentPayments.map((p: any) => ({
        id: p._id.toString(),
        type: 'PAYMENT' as const,
        title: `Paiement reçu — Apt ${p.apartmentId?.number || 'Unit'}`,
        subtitle: `${p.amount?.toLocaleString()} DZD via ${p.paymentMethod}`,
        timestamp: p.paymentDate || p.createdAt,
        amount: p.amount,
      })),
      ...recentIncidents.map((i: any) => ({
        id: i._id.toString(),
        type: 'INCIDENT' as const,
        title: `Incident: ${i.title}`,
        subtitle: `${i.type} • Priorité ${i.priority}`,
        timestamp: i.createdAt,
        severity: i.priority,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

    return {
      success: true,
      data: {
        kpis: {
          totalResidences: residencesCount,
          totalBuildings: buildings.length,
          totalApartments,
          occupiedApartments,
          vacantApartments,
          occupancyRate,
          expectedChargesThisMonth: expectedCharges,
          collectedChargesThisMonth: collectedCharges,
          unpaidChargesThisMonth: unpaidThisMonth,
          collectionRate,
          totalOutstandingDebt,
          monthlyExpenses,
          openInterventionsCount: openInterventions.length,
          criticalIncidentsCount: criticalIncidents.length,
          equipmentOutOfServiceCount: outOfServiceEquipment.length,
        },
        toHandle: {
          unpaidApartmentsCount,
          overdueBillsCount: overdueBills.length,
          urgentMaintenanceCount: openInterventions.filter((i: any) => i.priority === 'CRITICAL' || i.priority === 'HIGH').length,
          criticalIncidentsCount: criticalIncidents.length,
          overdueTasksCount: overdueTasks.length,
          failingEquipmentCount: outOfServiceEquipment.length,
        },
        buildingsPerformance,
        recentActivity,
      },
    };
  });
