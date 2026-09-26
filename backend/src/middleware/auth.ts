import { Elysia } from 'elysia';
import { verifyAccessToken } from '@saas/security';
import type { UserSessionPayload, OrganizationRole } from '@saas/types';

export const authMiddleware = new Elysia({ name: 'auth-middleware' }).derive(
  { as: 'global' },
  async ({ request }): Promise<{ user: UserSessionPayload | null }> => {
    const authHeader = request.headers.get('authorization');
    let token = '';

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Look in cookie
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      return { user: null };
    }

    const payload = await verifyAccessToken(token);
    return { user: payload };
  }
);

// Guards
export function requireAuth(user: UserSessionPayload | null) {
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
}

export function requireSuperAdmin(user: UserSessionPayload | null) {
  requireAuth(user);
  if (!user?.isSuperAdmin) {
    throw new Error('FORBIDDEN_SUPER_ADMIN_REQUIRED');
  }
}

export function requireOrgRole(
  user: UserSessionPayload | null,
  allowedRoles: OrganizationRole[]
) {
  requireAuth(user);
  if (!user?.activeOrgRole || !allowedRoles.includes(user.activeOrgRole)) {
    throw new Error('FORBIDDEN_INSUFFICIENT_PERMISSIONS');
  }
}
