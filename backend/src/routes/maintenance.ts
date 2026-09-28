import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import {
  EquipmentModel,
  IncidentModel,
  InterventionModel,
} from '@saas/database';
import {
  CreateEquipmentSchema,
  ReportIncidentSchema,
  CreateInterventionSchema,
  UpdateInterventionStatusSchema,
} from '@saas/validation';

export const maintenanceRoutes = new Elysia({ prefix: '/api/v1/maintenance' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // ----------------------------------------------------
  // EQUIPMENT REGISTRY
  // ----------------------------------------------------

  .get('/equipment', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const equipment: any[] = await EquipmentModel.find(filter)
      .populate('buildingId', 'name')
      .sort({ status: -1, name: 1 })
      .lean();

    return {
      success: true,
      data: equipment.map((e) => ({
        id: e._id.toString(),
        residenceId: e.residenceId.toString(),
        buildingName: e.buildingId?.name || 'Général',
        name: e.name,
        type: e.type,
        brandModel: e.brandModel,
        status: e.status,
        lastMaintenanceDate: e.lastMaintenanceDate,
        nextMaintenanceDate: e.nextMaintenanceDate,
        providerName: e.providerName,
        providerPhone: e.providerPhone,
      })),
    };
  })

  .post('/equipment', async ({ authUser, body, set }) => {
    const parsed = CreateEquipmentSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const item = await EquipmentModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
    });

    return {
      success: true,
      data: {
        id: item._id.toString(),
        name: item.name,
        status: item.status,
      },
    };
  })

  // ----------------------------------------------------
  // INCIDENTS
  // ----------------------------------------------------

  .get('/incidents', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;
    if (query?.status) filter.status = query.status;

    const incidents: any[] = await IncidentModel.find(filter)
      .populate('buildingId', 'name')
      .populate('apartmentId', 'number')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: incidents.map((i) => ({
        id: i._id.toString(),
        residenceId: i.residenceId.toString(),
        buildingName: i.buildingId?.name,
        apartmentNumber: i.apartmentId?.number,
        type: i.type,
        priority: i.priority,
        title: i.title,
        description: i.description,
        reporterName: i.reporterName,
        reporterPhone: i.reporterPhone,
        mediaUrls: i.mediaUrls || [],
        status: i.status,
        resolutionDetails: i.resolutionDetails,
        createdAt: i.createdAt,
      })),
    };
  })

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
      status: 'REPORTED',
    });

    return {
      success: true,
      data: {
        id: incident._id.toString(),
        title: incident.title,
        status: incident.status,
      },
    };
  })

  .patch('/incidents/:id/status', async ({ params, body, set }) => {
    const { status, resolutionDetails } = (body as any) || {};
    const update: any = { status };
    if (status === 'RESOLVED' || status === 'CLOSED') {
      update.resolvedAt = new Date();
      if (resolutionDetails) update.resolutionDetails = resolutionDetails;
    }

    const incident = await IncidentModel.findByIdAndUpdate(params.id, update, { new: true });
    if (!incident) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Incident not found' } };
    }

    return {
      success: true,
      data: {
        id: incident._id.toString(),
        status: incident.status,
      },
    };
  })

  // ----------------------------------------------------
  // INTERVENTIONS (Maintenance Tickets)
  // ----------------------------------------------------

  .get('/interventions', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const interventions: any[] = await InterventionModel.find(filter)
      .populate('equipmentId', 'name')
      .populate('buildingId', 'name')
      .populate('assignedStaffId', 'fullName phone')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: interventions.map((item) => ({
        id: item._id.toString(),
        residenceId: item.residenceId.toString(),
        equipmentName: item.equipmentId?.name,
        buildingName: item.buildingId?.name,
        title: item.title,
        description: item.description,
        assignedStaffName: item.assignedStaffId?.fullName,
        externalProvider: item.externalProvider,
        cost: item.cost,
        priority: item.priority,
        status: item.status,
        scheduledDate: item.scheduledDate,
        createdAt: item.createdAt,
      })),
    };
  })

  .post('/interventions', async ({ authUser, body, set }) => {
    const parsed = CreateInterventionSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const intervention = await InterventionModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'NEW',
    });

    return {
      success: true,
      data: {
        id: intervention._id.toString(),
        title: intervention.title,
        status: intervention.status,
      },
    };
  })

  .patch('/interventions/:id/status', async ({ params, body, set }) => {
    const parsed = UpdateInterventionStatusSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const item = await InterventionModel.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!item) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Intervention not found' } };
    }

    return {
      success: true,
      data: {
        id: item._id.toString(),
        status: item.status,
      },
    };
  });
