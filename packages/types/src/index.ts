/**
 * Enterprise SaaS System Shared Types & Data Contracts
 */

// Roles & Permissions
export type SystemRole = 'SUPER_ADMIN' | 'USER';

export type OrganizationRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type Permission =
  | 'org:read'
  | 'org:update'
  | 'org:delete'
  | 'org:billing:manage'
  | 'members:read'
  | 'members:invite'
  | 'members:update'
  | 'members:remove'
  | 'audit:read'
  | 'settings:manage';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  subscription: {
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: string;
  };
  settings: {
    mfaEnforced: boolean;
    allowedDomains: string[];
    defaultRole: OrganizationRole;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  permissions: Permission[];
  invitedAt?: string;
  joinedAt?: string;
}

export interface UserSessionPayload {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  activeOrgId?: string;
  activeOrgRole?: OrganizationRole;
  sessionId: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId?: string;
  actor: {
    id: string;
    email: string;
    isSuperAdmin: boolean;
    ipAddress?: string;
    userAgent?: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

// API Standard Contract
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
