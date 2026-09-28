import { z } from 'zod';

// MongoDB ObjectId validation regex
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const ObjectIdSchema = z.string().regex(objectIdRegex, 'Invalid ObjectId format');

// Password security policy
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password cannot exceed 128 characters');

// ==========================================
// Authentication Schemas
// ==========================================

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

// Organization & Membership Schemas
export const CreateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  slug: z.string().min(2).max(50).trim().optional(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export const InviteMemberSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  role: z.enum(['ADMIN', 'MEMBER', 'GUEST', 'RESIDENCE_MANAGER', 'BUILDING_MANAGER', 'STAFF', 'RESIDENT']),
});

// ==========================================
// Physical Infrastructure Schemas
// ==========================================

export const CreateResidenceSchema = z.object({
  name: z.string().min(2, 'Residence name must be at least 2 characters').max(150).trim(),
  code: z.string().min(2).max(20).trim().optional(),
  typeId: ObjectIdSchema.optional(),
  typeName: z.string().max(50).optional(),
  wilaya: z.string().min(2, 'Wilaya is required').max(50).trim(),
  commune: z.string().min(2, 'Commune is required').max(50).trim(),
  address: z.string().min(5, 'Address is required').max(200).trim(),
  totalBuildings: z.coerce.number().int().min(1).default(1),
  totalApartments: z.coerce.number().int().min(1).default(1),
  notes: z.string().max(500).optional(),
});

export const UpdateResidenceSchema = CreateResidenceSchema.partial();

export const CreateBuildingSchema = z.object({
  residenceId: ObjectIdSchema,
  name: z.string().min(1, 'Building name/number is required').max(50).trim(),
  floorsCount: z.coerce.number().int().min(1).default(5),
  apartmentsCount: z.coerce.number().int().min(1).default(20),
  description: z.string().max(300).optional(),
});

export const UpdateBuildingSchema = CreateBuildingSchema.partial();

export const CreateApartmentSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema,
  number: z.string().min(1, 'Apartment number is required').max(20).trim(),
  floor: z.coerce.number().int().min(0).default(0),
  type: z.string().min(1).max(20).default('F3'), // F2, F3, F4, etc.
  surfaceM2: z.coerce.number().positive().optional(),
  occupancyStatus: z.enum(['OCCUPIED', 'VACANT', 'UNDER_MAINTENANCE']).default('VACANT'),
  monthlyChargeAmount: z.coerce.number().min(0).default(2000), // DZD
  initialBalance: z.coerce.number().default(0),
});

export const UpdateApartmentSchema = CreateApartmentSchema.partial();

export const CreateResidentSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema,
  apartmentId: ObjectIdSchema,
  fullName: z.string().min(2, 'Full name is required').max(100).trim(),
  phone: z.string().min(8, 'Phone number is required').max(20).trim(),
  email: z.string().email().trim().toLowerCase().optional().or(z.literal('')),
  residentType: z.enum(['OWNER', 'TENANT']).default('OWNER'),
  occupancyStartDate: z.string().default(() => new Date().toISOString()),
  notes: z.string().max(500).optional(),
});

export const UpdateResidentSchema = CreateResidentSchema.partial();

// ==========================================
// Financial Schemas
// ==========================================

export const CreateChargeDefinitionSchema = z.object({
  residenceId: ObjectIdSchema,
  title: z.string().min(2).max(100).trim(),
  categoryTypeId: ObjectIdSchema.optional(),
  categoryName: z.string().max(50).optional(),
  amount: z.coerce.number().positive('Charge amount must be positive'),
  frequency: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'ONE_TIME']).default('MONTHLY'),
  appliesTo: z.enum(['ALL', 'BUILDING', 'APARTMENT']).default('ALL'),
  targetBuildingId: ObjectIdSchema.optional(),
  targetApartmentId: ObjectIdSchema.optional(),
  dueDay: z.coerce.number().int().min(1).max(31).default(5),
});

export const RecordPaymentSchema = z.object({
  residenceId: ObjectIdSchema,
  apartmentId: ObjectIdSchema,
  residentId: ObjectIdSchema.optional(),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be in YYYY-MM format'),
  amount: z.coerce.number().positive('Payment amount must be greater than 0'),
  paymentDate: z.string().default(() => new Date().toISOString()),
  paymentMethod: z.enum(['CASH', 'CCP', 'EDAHABIA', 'CIB', 'CHEQUE', 'BANK_TRANSFER', 'OTHER']).default('CASH'),
  transactionReference: z.string().max(100).optional(),
  proofDocumentUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(300).optional(),
});

export const CreateExpenseSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema.optional(),
  category: z.string().min(2).max(50).trim(),
  amount: z.coerce.number().positive('Amount must be positive'),
  expenseDate: z.string().default(() => new Date().toISOString()),
  supplierName: z.string().min(2).max(100).trim(),
  supplierPhone: z.string().max(20).optional(),
  paymentMethod: z.enum(['CASH', 'CCP', 'EDAHABIA', 'CIB', 'CHEQUE', 'BANK_TRANSFER', 'OTHER']).default('CASH'),
  receiptUrl: z.string().optional(),
  description: z.string().max(500).optional(),
});

export const CreateBillSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema.optional(),
  serviceType: z.enum(['ELECTRICITY', 'WATER', 'GAS', 'ELEVATOR_CONTRACT', 'SECURITY', 'CLEANING', 'OTHER']),
  providerName: z.string().min(2).max(100).trim(),
  referenceNumber: z.string().min(1).max(100).trim(),
  billingPeriod: z.string().min(2).max(50).trim(),
  amount: z.coerce.number().positive('Amount must be positive'),
  dueDate: z.string(),
  documentUrl: z.string().optional(),
  notes: z.string().max(300).optional(),
});

// ==========================================
// Maintenance & Incidents Schemas
// ==========================================

export const CreateEquipmentSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema.optional(),
  name: z.string().min(2).max(100).trim(),
  type: z.string().min(2).max(50).trim(),
  brandModel: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  installationDate: z.string().optional(),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE']).default('OPERATIONAL'),
  providerName: z.string().max(100).optional(),
  providerPhone: z.string().max(20).optional(),
  nextMaintenanceDate: z.string().optional(),
});

export const ReportIncidentSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema.optional(),
  apartmentId: ObjectIdSchema.optional(),
  type: z.string().min(2).max(50).trim(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  title: z.string().min(3).max(150).trim(),
  description: z.string().min(5).max(1000).trim(),
  reporterName: z.string().min(2).max(100).trim(),
  reporterPhone: z.string().max(20).optional(),
  mediaUrls: z.array(z.string()).default([]),
});

export const CreateInterventionSchema = z.object({
  residenceId: ObjectIdSchema,
  incidentId: ObjectIdSchema.optional(),
  equipmentId: ObjectIdSchema.optional(),
  buildingId: ObjectIdSchema.optional(),
  title: z.string().min(3).max(150).trim(),
  description: z.string().min(5).max(1000).trim(),
  assignedStaffId: ObjectIdSchema.optional(),
  externalProvider: z.string().max(100).optional(),
  externalProviderPhone: z.string().max(20).optional(),
  cost: z.coerce.number().min(0).default(0),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  scheduledDate: z.string().optional(),
});

export const UpdateInterventionStatusSchema = z.object({
  status: z.enum(['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS', 'RESOLVED', 'CLOSED']),
  resolutionNotes: z.string().max(1000).optional(),
  completedDate: z.string().optional(),
});

// ==========================================
// Staff, Tasks & Announcements Schemas
// ==========================================

export const CreateStaffMemberSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  phone: z.string().min(8).max(20).trim(),
  functionTitle: z.string().min(2).max(50).trim(),
  assignedResidenceIds: z.array(ObjectIdSchema).default([]),
  assignedBuildingIds: z.array(ObjectIdSchema).default([]),
  monthlySalary: z.coerce.number().min(0).optional(),
  startDate: z.string().default(() => new Date().toISOString()),
});

export const CreateTaskSchema = z.object({
  residenceId: ObjectIdSchema,
  buildingId: ObjectIdSchema.optional(),
  assignedStaffId: ObjectIdSchema.optional(),
  title: z.string().min(3).max(150).trim(),
  description: z.string().max(500).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  deadline: z.string().optional(),
});

export const CreateAnnouncementSchema = z.object({
  residenceId: ObjectIdSchema,
  targetScope: z.enum(['ALL_RESIDENCE', 'SPECIFIC_BUILDINGS']).default('ALL_RESIDENCE'),
  targetBuildingIds: z.array(ObjectIdSchema).optional(),
  title: z.string().min(3).max(150).trim(),
  content: z.string().min(5).max(2000).trim(),
  category: z.enum(['GENERAL', 'MAINTENANCE_ALERT', 'WATER_CUT', 'CHARGES_REMINDER']).default('GENERAL'),
  priority: z.enum(['NORMAL', 'URGENT']).default('NORMAL'),
  expiresAt: z.string().optional(),
});

export const CreateLookupItemSchema = z.object({
  group: z.enum([
    'RESIDENCE_TYPE',
    'CHARGE_TYPE',
    'PAYMENT_METHOD',
    'EXPENSE_CATEGORY',
    'BILL_TYPE',
    'INCIDENT_TYPE',
    'EQUIPMENT_TYPE',
    'STAFF_FUNCTION',
    'DOCUMENT_CATEGORY',
  ]),
  code: z.string().min(2).max(50).trim().toLowerCase(),
  label: z.object({
    fr: z.string().min(1).max(100).trim(),
    ar: z.string().max(100).trim().optional(),
    en: z.string().max(100).trim().optional(),
  }),
  order: z.coerce.number().int().default(0),
});

// ==========================================
// Query & Utility Schemas
// ==========================================

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(100).trim().optional(),
  residenceId: z.string().optional(),
  buildingId: z.string().optional(),
  status: z.string().optional(),
  period: z.string().optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Sanitizer helper to disallow MongoDB operator injection (keys starting with $ or containing .)
export function sanitizeMongoInput<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeMongoInput(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}
