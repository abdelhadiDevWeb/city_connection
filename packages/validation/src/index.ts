import { z } from 'zod';

// MongoDB ObjectId validation regex
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const ObjectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId format');

// Password security policy: Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Authentication Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  password: PasswordSchema,
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters').max(100).trim().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().length(6, 'MFA code must be 6 digits').optional(),
});

export const SuperAdminLoginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  totpCode: z.string().length(6, 'TOTP token is required for Super Admin access'),
});

// Organization & Tenant Schemas
export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with hyphens only')
    .trim(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export const InviteMemberSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST']),
});

// Query Pagination & Search Schema
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).trim().optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Sanitizer helper to disallow MongoDB operator injection (keys starting with $ or containing .)
export function sanitizeMongoInput<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue; // Discard potential NoSQL injection operator keys
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeMongoInput(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SuperAdminLoginInput = z.infer<typeof SuperAdminLoginSchema>;
export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
