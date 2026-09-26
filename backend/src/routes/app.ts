import { Elysia } from 'elysia';
import { authMiddleware, requireAuth } from '../middleware/auth';
import { UserModel, MembershipModel } from '@saas/database';
import { signAccessToken, generateSecureToken } from '@saas/security';

export const appRoutes = new Elysia({ prefix: '/api/v1/app' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireAuth(user);
    return { authUser: user! };
  })

  // Get current user profile and list of member organizations
  .get('/me', async ({ authUser }) => {
    const [user, memberships] = await Promise.all([
      UserModel.findById(authUser.userId).lean() as Promise<any>,
      MembershipModel.find({ userId: authUser.userId })
        .populate('organizationId', 'name slug logoUrl subscription')
        .lean(),
    ]);

    return {
      success: true,
      data: {
        user: {
          id: user?._id ? String(user._id) : '',
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          avatarUrl: user?.avatarUrl,
          isSuperAdmin: Boolean(user?.isSuperAdmin),
          mfaEnabled: Boolean(user?.mfaEnabled),
        },
        activeOrgId: authUser.activeOrgId,
        activeOrgRole: authUser.activeOrgRole,
        organizations: memberships.map((m: any) => {
          const org = m.organizationId || {};
          return {
            id: org._id ? String(org._id) : '',
            name: org.name || '',
            slug: org.slug || '',
            logoUrl: org.logoUrl,
            role: m.role,
          };
        }),
      },
    };
  })

  // Switch active organization context
  .post('/switch-org/:orgId', async ({ authUser, params, set }) => {
    const membership = await MembershipModel.findOne({
      userId: authUser.userId,
      organizationId: params.orgId,
    });

    if (!membership) {
      set.status = 403;
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not a member of this organization' },
      };
    }

    const sessionId = generateSecureToken(16);
    const newToken = await signAccessToken({
      userId: authUser.userId,
      email: authUser.email,
      isSuperAdmin: authUser.isSuperAdmin,
      activeOrgId: params.orgId,
      activeOrgRole: membership.role,
      sessionId,
    });

    return {
      success: true,
      data: {
        accessToken: newToken,
        activeOrgId: params.orgId,
        activeOrgRole: membership.role,
      },
    };
  });
