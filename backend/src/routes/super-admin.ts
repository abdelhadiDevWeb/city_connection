import { Elysia } from 'elysia';
import { authMiddleware, requireSuperAdmin } from '../middleware/auth';
import {
  UserModel,
  OrganizationModel,
  AuditLogModel,
} from '@saas/database';
import { PaginationQuerySchema } from '@saas/validation';

export const superAdminRoutes = new Elysia({ prefix: '/api/v1/super-admin' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireSuperAdmin(user);
    return { adminUser: user! };
  })
  // Platform Overview & KPIs
  .get('/stats', async () => {
    const [totalUsers, totalTenants, tierBreakdown, recentAuditLogs] = await Promise.all([
      UserModel.countDocuments(),
      OrganizationModel.countDocuments(),
      OrganizationModel.aggregate([
        { $group: { _id: '$subscription.tier', count: { $sum: 1 } } },
      ]),
      AuditLogModel.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalTenants,
        tierBreakdown: tierBreakdown.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {} as Record<string, number>),
        recentAuditLogs: recentAuditLogs.map((log: any) => ({
          id: log._id ? String(log._id) : '',
          action: log.action,
          actor: log.actor?.email,
          createdAt: log.createdAt,
        })),
      },
    };
  })

  // List all tenants (Paginated)
  .get('/tenants', async ({ query }) => {
    const { page, limit, search } = PaginationQuerySchema.parse(query);
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }] }
      : {};

    const [tenants, total] = await Promise.all([
      OrganizationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrganizationModel.countDocuments(filter),
    ]);

    return {
      success: true,
      data: {
        items: tenants.map((t: any) => ({
          id: t._id ? String(t._id) : '',
          name: t.name,
          slug: t.slug,
          subscription: t.subscription,
          createdAt: t.createdAt,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    };
  })

  // System-wide Audit Logs
  .get('/audit-logs', async ({ query }) => {
    const { page, limit } = PaginationQuerySchema.parse(query);

    const [logs, total] = await Promise.all([
      AuditLogModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditLogModel.countDocuments(),
    ]);

    return {
      success: true,
      data: {
        items: logs.map((l: any) => ({
          id: l._id ? String(l._id) : '',
          action: l.action,
          resource: l.resource,
          actor: l.actor,
          details: l.details,
          createdAt: l.createdAt,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    };
  });
