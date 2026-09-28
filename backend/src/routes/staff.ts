import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import { StaffMemberModel, TaskModel } from '@saas/database';
import { CreateStaffMemberSchema, CreateTaskSchema } from '@saas/validation';

export const staffRoutes = new Elysia({ prefix: '/api/v1/staff' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // ----------------------------------------------------
  // STAFF MEMBERS
  // ----------------------------------------------------

  .get('/', async ({ authUser }) => {
    const filter: any = { status: { $ne: 'TERMINATED' } };
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;

    const staff: any[] = await StaffMemberModel.find(filter)
      .populate('assignedResidenceIds', 'name')
      .populate('assignedBuildingIds', 'name')
      .sort({ fullName: 1 })
      .lean();

    return {
      success: true,
      data: staff.map((s) => ({
        id: s._id.toString(),
        fullName: s.fullName,
        phone: s.phone,
        functionTitle: s.functionTitle,
        assignedResidences: s.assignedResidenceIds?.map((r: any) => r.name) || [],
        assignedBuildings: s.assignedBuildingIds?.map((b: any) => b.name) || [],
        status: s.status,
        monthlySalary: s.monthlySalary,
        startDate: s.startDate,
      })),
    };
  })

  .post('/', async ({ authUser, body, set }) => {
    const parsed = CreateStaffMemberSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const staff = await StaffMemberModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'ACTIVE',
    });

    return {
      success: true,
      data: {
        id: staff._id.toString(),
        fullName: staff.fullName,
      },
    };
  })

  // ----------------------------------------------------
  // DAILY TASKS
  // ----------------------------------------------------

  .get('/tasks', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const tasks: any[] = await TaskModel.find(filter)
      .populate('assignedStaffId', 'fullName phone')
      .populate('buildingId', 'name')
      .sort({ deadline: 1, createdAt: -1 })
      .lean();

    return {
      success: true,
      data: tasks.map((t) => ({
        id: t._id.toString(),
        residenceId: t.residenceId.toString(),
        buildingName: t.buildingId?.name || 'Toute la cité',
        assignedStaffName: t.assignedStaffId?.fullName || 'Non assigné',
        title: t.title,
        description: t.description,
        priority: t.priority,
        deadline: t.deadline,
        status: t.status,
      })),
    };
  })

  .post('/tasks', async ({ authUser, body, set }) => {
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const task = await TaskModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      status: 'PENDING',
    });

    return {
      success: true,
      data: {
        id: task._id.toString(),
        title: task.title,
        status: task.status,
      },
    };
  })

  .patch('/tasks/:id/complete', async ({ params, body, set }) => {
    const { completionProofUrl } = (body as any) || {};

    const task = await TaskModel.findByIdAndUpdate(
      params.id,
      {
        status: 'COMPLETED',
        completedAt: new Date(),
        completionProofUrl,
      },
      { new: true }
    );

    if (!task) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Task not found' } };
    }

    return {
      success: true,
      data: {
        id: task._id.toString(),
        status: task.status,
        completedAt: task.completedAt,
      },
    };
  });
