import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import { AnnouncementModel, DocumentItemModel } from '@saas/database';
import { CreateAnnouncementSchema } from '@saas/validation';

export const announcementRoutes = new Elysia({ prefix: '/api/v1/announcements' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // List announcements
  .get('/', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const announcements = await AnnouncementModel.find(filter)
      .sort({ publishedAt: -1 })
      .lean();

    return {
      success: true,
      data: announcements.map((a: any) => ({
        id: a._id.toString(),
        residenceId: a.residenceId.toString(),
        targetScope: a.targetScope,
        title: a.title,
        content: a.content,
        category: a.category,
        priority: a.priority,
        publishedAt: a.publishedAt,
        expiresAt: a.expiresAt,
      })),
    };
  })

  // Publish announcement
  .post('/', async ({ authUser, body, set }) => {
    const parsed = CreateAnnouncementSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const item = await AnnouncementModel.create({
      organizationId: authUser.activeOrgId,
      ...parsed.data,
      publishedAt: new Date(),
    });

    return {
      success: true,
      data: {
        id: item._id.toString(),
        title: item.title,
        publishedAt: item.publishedAt,
      },
    };
  })

  // ----------------------------------------------------
  // DOCUMENTS REPOSITORY
  // ----------------------------------------------------

  .get('/documents', async ({ authUser, query }) => {
    const filter: any = {};
    if (authUser.activeOrgId) filter.organizationId = authUser.activeOrgId;
    if (query?.residenceId) filter.residenceId = query.residenceId;

    const docs = await DocumentItemModel.find(filter).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: docs.map((d: any) => ({
        id: d._id.toString(),
        residenceId: d.residenceId.toString(),
        attachedToType: d.attachedToType,
        title: d.title,
        fileUrl: d.fileUrl,
        fileType: d.fileType,
        fileSizeBytes: d.fileSizeBytes,
        createdAt: d.createdAt,
      })),
    };
  });
