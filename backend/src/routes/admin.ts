import { Elysia } from 'elysia';
import { authMiddleware, requireOrgRole } from '../middleware/auth';
import {
  OrganizationModel,
  MembershipModel,
  UserModel,
  AuditLogModel,
} from '@saas/database';
import { UpdateOrganizationSchema, InviteMemberSchema } from '@saas/validation';

export const tenantAdminRoutes = new Elysia({ prefix: '/api/v1/admin' })
  .use(authMiddleware)
  .derive({ as: 'scoped' }, ({ user }) => {
    requireOrgRole(user, ['OWNER', 'ADMIN']);
    return { authUser: user! };
  })

  // Get active organization information
  .get('/organization', async ({ authUser, set }) => {
    const org: any = await OrganizationModel.findById(authUser.activeOrgId).lean();
    if (!org) {
      set.status = 404;
      return { success: false, error: { code: 'NOT_FOUND', message: 'Organization not found' } };
    }

    return {
      success: true,
      data: {
        id: org._id ? String(org._id) : '',
        name: org.name,
        slug: org.slug,
        logoUrl: org.logoUrl,
        subscription: org.subscription,
        settings: org.settings,
        createdAt: org.createdAt,
      },
    };
  })

  // Update organization settings
  .patch('/organization', async ({ authUser, body, set, request }) => {
    const parseResult = UpdateOrganizationSchema.safeParse(body);
    if (!parseResult.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid update data' },
      };
    }

    const updated = await OrganizationModel.findByIdAndUpdate(
      authUser.activeOrgId,
      { $set: parseResult.data },
      { new: true }
    ).lean();

    // Audit log
    await AuditLogModel.create({
      organizationId: authUser.activeOrgId,
      actor: {
        id: authUser.userId,
        email: authUser.email,
        isSuperAdmin: false,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      action: 'organization.updated',
      resource: 'Organization',
      resourceId: authUser.activeOrgId,
      details: parseResult.data,
    });

    return {
      success: true,
      data: updated,
    };
  })

  // List organization members
  .get('/members', async ({ authUser }) => {
    const memberships = await MembershipModel.find({ organizationId: authUser.activeOrgId })
      .populate('userId', 'email firstName lastName avatarUrl')
      .lean();

    return {
      success: true,
      data: memberships.map((m: any) => {
        const u = m.userId || {};
        return {
          id: m._id ? String(m._id) : '',
          user: {
            id: u._id ? String(u._id) : '',
            email: u.email || '',
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || '',
          },
          role: m.role,
          permissions: m.permissions,
          joinedAt: m.joinedAt,
        };
      }),
    };
  })

  // Invite member
  .post('/members/invite', async ({ authUser, body, set, request }) => {
    const parseResult = InviteMemberSchema.safeParse(body);
    if (!parseResult.success) {
      set.status = 400;
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid invite parameters' },
      };
    }

    const { email, role } = parseResult.data;

    let targetUser = await UserModel.findOne({ email });
    if (!targetUser) {
      targetUser = await UserModel.create({
        email,
        passwordHash: 'pending_invitation',
        isEmailVerified: false,
      });
    }

    // Check if membership already exists
    const existingMembership = await MembershipModel.findOne({
      userId: targetUser._id,
      organizationId: authUser.activeOrgId,
    });

    if (existingMembership) {
      set.status = 409;
      return {
        success: false,
        error: { code: 'MEMBER_EXISTS', message: 'User is already a member of this organization' },
      };
    }

    const membership = await MembershipModel.create({
      userId: targetUser._id,
      organizationId: authUser.activeOrgId,
      role,
      permissions: role === 'ADMIN' ? ['org:read', 'org:update', 'members:invite'] : ['org:read'],
      invitedAt: new Date(),
    });

    // Audit log
    await AuditLogModel.create({
      organizationId: authUser.activeOrgId,
      actor: {
        id: authUser.userId,
        email: authUser.email,
        isSuperAdmin: false,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      action: 'member.invited',
      resource: 'Membership',
      resourceId: membership._id.toString(),
      details: { invitedEmail: email, role },
    });

    return {
      success: true,
      data: {
        id: membership._id.toString(),
        email,
        role: membership.role,
      },
    };
  });
