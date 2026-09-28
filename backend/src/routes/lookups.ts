import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import { LookupItemModel } from '@saas/database';
import { CreateLookupItemSchema } from '@saas/validation';

export const lookupRoutes = new Elysia({ prefix: '/api/v1/lookups' })
  .use(authMiddleware)

  // Get items by group
  .get('/:group', async ({ params, user }) => {
    const group = params.group.toUpperCase();
    const filter: any = { group, isActive: true };

    const items = await LookupItemModel.find(filter).sort({ order: 1 }).lean();

    return {
      success: true,
      data: items.map((i: any) => ({
        id: i._id.toString(),
        code: i.code,
        label: i.label,
        isSystem: i.isSystem,
        order: i.order,
      })),
    };
  })

  // Create custom lookup item
  .post('/', async ({ user, body, set }) => {
    requireAuth(user);

    const parsed = CreateLookupItemSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      };
    }

    const item = await LookupItemModel.create({
      organizationId: user!.activeOrgId,
      ...parsed.data,
      isSystem: false,
      isActive: true,
    });

    return {
      success: true,
      data: {
        id: item._id.toString(),
        code: item.code,
        label: item.label,
      },
    };
  });
