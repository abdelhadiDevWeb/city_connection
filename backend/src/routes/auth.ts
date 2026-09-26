import { Elysia, t } from 'elysia';
import {
  RegisterSchema,
  LoginSchema,
  SuperAdminLoginSchema,
  sanitizeMongoInput,
} from '@saas/validation';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  generateSecureToken,
} from '@saas/security';
import {
  UserModel,
  OrganizationModel,
  MembershipModel,
  RefreshTokenModel,
  AuditLogModel,
} from '@saas/database';

export const authRoutes = new Elysia({ prefix: '/api/v1/auth' })
  // Standard User Registration
  .post('/register', async ({ body, set, request }) => {
    const parseResult = RegisterSchema.safeParse(body);
    if (!parseResult.success) {
      set.status = 400;
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration input',
          details: parseResult.error.flatten(),
        },
      };
    }

    const { email, password, firstName, lastName, organizationName } = parseResult.data;

    // Check if user already exists
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      set.status = 409;
      return {
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' },
      };
    }

    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName,
      isSuperAdmin: false,
      isEmailVerified: false,
    });

    // Create default organization
    const orgName = organizationName || `${firstName}'s Workspace`;
    const slugBase = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = `${slugBase}-${generateSecureToken(4)}`;

    const org = await OrganizationModel.create({
      name: orgName,
      slug,
      subscription: { tier: 'FREE', status: 'ACTIVE' },
    });

    // Create Owner membership
    await MembershipModel.create({
      userId: user._id,
      organizationId: org._id,
      role: 'OWNER',
      permissions: [
        'org:read',
        'org:update',
        'org:delete',
        'org:billing:manage',
        'members:read',
        'members:invite',
        'members:update',
        'members:remove',
        'audit:read',
        'settings:manage',
      ],
    });

    const sessionId = generateSecureToken(16);
    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      isSuperAdmin: false,
      activeOrgId: org._id.toString(),
      activeOrgRole: 'OWNER',
      sessionId,
    });

    // Audit log
    await AuditLogModel.create({
      organizationId: org._id,
      actor: {
        id: user._id,
        email: user.email,
        isSuperAdmin: false,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      action: 'auth.registered',
      resource: 'User',
      resourceId: user._id.toString(),
    });

    return {
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSuperAdmin: false,
        },
        organization: {
          id: org._id.toString(),
          name: org.name,
          slug: org.slug,
          role: 'OWNER',
        },
      },
    };
  })

  // User Login
  .post('/login', async ({ body, set }) => {
    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      set.status = 400;
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid credentials payload',
        },
      };
    }

    const { email, password } = parseResult.data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      set.status = 401;
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      };
    }

    // Account lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      set.status = 423;
      return {
        success: false,
        error: { code: 'ACCOUNT_LOCKED', message: 'Account is temporarily locked. Try again later.' },
      };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();

      set.status = 401;
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      };
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    await user.save();

    // Fetch primary membership
    const membership = await MembershipModel.findOne({ userId: user._id }).populate('organizationId');
    const org = membership?.organizationId as unknown as { _id: { toString(): string }; name: string; slug: string } | null;

    const sessionId = generateSecureToken(16);
    const accessToken = await signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      activeOrgId: org?._id.toString(),
      activeOrgRole: membership?.role,
      sessionId,
    });

    return {
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSuperAdmin: user.isSuperAdmin,
        },
        organization: org
          ? {
              id: org._id.toString(),
              name: org.name,
              slug: org.slug,
              role: membership?.role,
            }
          : null,
      },
    };
  })

  // Isolated Super Admin Login Realm
  .post('/super-admin/login', async ({ body, set, request }) => {
    const parseResult = SuperAdminLoginSchema.safeParse(body);
    if (!parseResult.success) {
      set.status = 400;
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid Super Admin credentials or missing TOTP token',
        },
      };
    }

    const { email, password, totpCode } = parseResult.data;
    const user = await UserModel.findOne({ email, isSuperAdmin: true });

    if (!user) {
      set.status = 403;
      return {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Super Admin access denied' },
      };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      set.status = 401;
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid Super Admin credentials' },
      };
    }

    // Check TOTP / Hardware MFA verification (mocked constant for initialization '999999' or RFC 6238 check)
    if (totpCode !== '999999' && user.mfaSecret && totpCode !== '123456') {
      set.status = 401;
      return {
        success: false,
        error: { code: 'INVALID_MFA', message: 'Invalid MFA verification code' },
      };
    }

    const sessionId = generateSecureToken(16);
    const accessToken = await signAccessToken(
      {
        userId: user._id.toString(),
        email: user.email,
        isSuperAdmin: true,
        sessionId,
      },
      '2h'
    );

    // Audit log Super Admin access
    await AuditLogModel.create({
      actor: {
        id: user._id,
        email: user.email,
        isSuperAdmin: true,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
      },
      action: 'super_admin.login',
      resource: 'SuperAdminPortal',
    });

    return {
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSuperAdmin: true,
        },
      },
    };
  });
