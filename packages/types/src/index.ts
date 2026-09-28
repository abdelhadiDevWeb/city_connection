/**
 * Cité Connect — Residence Management Platform
 * Shared TypeScript Contracts, DTOs & Domain Types
 */

// ==========================================
// 1. Roles & Permissions (RBAC)
// ==========================================

export type SystemRole = 'SUPER_ADMIN' | 'USER';

export type ResidenceRole =
  | 'ORG_OWNER'           // Agency Owner / Head Syndic
  | 'RESIDENCE_MANAGER'   // Manager assigned to specific residences
  | 'BUILDING_MANAGER'    // Scoped manager for designated buildings
  | 'STAFF'               // Technicians, gardiens, concierges (tasks & incidents)
  | 'RESIDENT';           // Apartment tenant or owner

export type OrganizationRole = ResidenceRole | 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type Permission =
  | 'residence:read'
  | 'residence:write'
  | 'residence:delete'
  | 'building:manage'
  | 'apartment:manage'
  | 'resident:manage'
  | 'finance:charges:manage'
  | 'finance:payments:create'
  | 'finance:payments:read'
  | 'finance:expenses:manage'
  | 'finance:bills:manage'
  | 'maintenance:read'
  | 'maintenance:write'
  | 'staff:manage'
  | 'announcements:publish'
  | 'documents:manage'
  | 'reports:export'
  | 'settings:lookups:manage';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionPayload {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  activeOrgId?: string;
  activeOrgRole?: OrganizationRole;
  residenceIds?: string[];
  sessionId: string;
}

// ==========================================
// 2. Dynamic Lookups (Section 21)
// ==========================================

export type LookupGroup =
  | 'RESIDENCE_TYPE'
  | 'CHARGE_TYPE'
  | 'PAYMENT_METHOD'
  | 'EXPENSE_CATEGORY'
  | 'BILL_TYPE'
  | 'INCIDENT_TYPE'
  | 'EQUIPMENT_TYPE'
  | 'STAFF_FUNCTION'
  | 'DOCUMENT_CATEGORY';

export interface LookupItem {
  id: string;
  organizationId?: string;
  group: LookupGroup;
  code: string;
  label: {
    fr: string;
    ar?: string;
    en?: string;
  };
  isSystem: boolean;
  order: number;
  isActive: boolean;
}

// ==========================================
// 3. Organization & Tenancy
// ==========================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  licenseType: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  contactEmail: string;
  contactPhone: string;
  address?: string;
  settings: {
    defaultCurrency: string;
    defaultChargeDueDay: number;
    allowResidentPortal: boolean;
    smsAlertsEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organizationId: string;
  role: ResidenceRole;
  assignedResidenceIds?: string[];
  assignedBuildingIds?: string[];
  permissions: Permission[];
  joinedAt: string;
}

// ==========================================
// 4. Physical Infrastructure
// ==========================================

export type ResidenceStatus = 'ACTIVE' | 'ARCHIVED';

export interface Residence {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  typeId?: string;
  typeName?: string;
  wilaya: string;
  commune: string;
  address: string;
  totalBuildings: number;
  totalApartments: number;
  status: ResidenceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  organizationId: string;
  residenceId: string;
  name: string;
  floorsCount: number;
  apartmentsCount: number;
  description?: string;
  status: ResidenceStatus;
  // Computed stats
  occupiedApartments?: number;
  totalUnpaidAmount?: number;
  openIncidentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type OccupancyStatus = 'OCCUPIED' | 'VACANT' | 'UNDER_MAINTENANCE';

export interface Apartment {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId: string;
  buildingName?: string;
  number: string;
  floor: number;
  type: string; // F2, F3, F4, F5, etc.
  surfaceM2?: number;
  occupancyStatus: OccupancyStatus;
  currentResidentId?: string;
  currentResidentName?: string;
  currentResidentPhone?: string;
  monthlyChargeAmount: number; // in DZD
  currentBalance: number; // positive = credit, negative = unpaid debt
  createdAt: string;
  updatedAt: string;
}

export type ResidentType = 'OWNER' | 'TENANT';

export interface ResidentProfile {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId: string;
  apartmentId: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  residentType: ResidentType;
  occupancyStartDate: string;
  occupancyEndDate?: string;
  notes?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. Finances
// ==========================================

export type ChargeFrequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME';

export interface ChargeDefinition {
  id: string;
  organizationId: string;
  residenceId: string;
  title: string;
  categoryTypeId?: string;
  categoryName?: string;
  amount: number;
  frequency: ChargeFrequency;
  appliesTo: 'ALL' | 'BUILDING' | 'APARTMENT';
  targetBuildingId?: string;
  targetApartmentId?: string;
  dueDay: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'CASH' | 'CCP' | 'EDAHABIA' | 'CIB' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';
export type PaymentStatus = 'VALIDATED' | 'PENDING' | 'CANCELLED';

export interface Payment {
  id: string;
  organizationId: string;
  residenceId: string;
  apartmentId: string;
  apartmentNumber?: string;
  buildingName?: string;
  residentId?: string;
  residentName?: string;
  chargeDefinitionId?: string;
  period: string; // e.g. "2026-03"
  amount: number; // DZD
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  receiptNumber: string; // e.g. "REC-2026-00124"
  proofDocumentUrl?: string;
  status: PaymentStatus;
  collectedByUserId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnpaidRecoveryItem {
  apartmentId: string;
  apartmentNumber: string;
  buildingId: string;
  buildingName: string;
  residentName: string;
  residentPhone: string;
  monthlyCharge: number;
  unpaidMonthsCount: number;
  totalDueAmount: number; // DZD
  lastPaymentDate?: string;
  lastPaymentPeriod?: string;
  status: 'CURRENT' | 'WARNING' | 'CRITICAL'; // CRITICAL if > 3 months overdue
}

export interface Expense {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId?: string;
  buildingName?: string;
  category: string;
  amount: number;
  expenseDate: string;
  supplierName: string;
  supplierPhone?: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  description?: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export type BillServiceType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'ELEVATOR_CONTRACT' | 'SECURITY' | 'CLEANING' | 'OTHER';
export type BillStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface Bill {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId?: string;
  buildingName?: string;
  serviceType: BillServiceType;
  providerName: string; // e.g. "Sonelgaz", "SEAAL"
  referenceNumber: string;
  billingPeriod: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: BillStatus;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 6. Maintenance, Equipment & Incidents
// ==========================================

export type EquipmentStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUT_OF_SERVICE' | 'UNDER_MAINTENANCE';

export interface Equipment {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId?: string;
  buildingName?: string;
  name: string;
  type: string; // Elevator, Booster Pump, Generator, etc.
  brandModel?: string;
  serialNumber?: string;
  installationDate?: string;
  status: EquipmentStatus;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  providerName?: string;
  providerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'REPORTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Incident {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId?: string;
  buildingName?: string;
  apartmentId?: string;
  apartmentNumber?: string;
  type: string;
  priority: PriorityLevel;
  title: string;
  description: string;
  reporterName: string;
  reporterPhone?: string;
  mediaUrls: string[];
  status: IncidentStatus;
  resolutionDetails?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InterventionStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'RESOLVED' | 'CLOSED';

export interface Intervention {
  id: string;
  organizationId: string;
  residenceId: string;
  incidentId?: string;
  equipmentId?: string;
  equipmentName?: string;
  buildingId?: string;
  buildingName?: string;
  title: string;
  description: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  externalProvider?: string;
  externalProviderPhone?: string;
  cost: number;
  priority: PriorityLevel;
  status: InterventionStatus;
  photosBefore: string[];
  photosAfter: string[];
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. Staff & Daily Tasks
// ==========================================

export interface StaffMember {
  id: string;
  organizationId: string;
  userId?: string;
  fullName: string;
  phone: string;
  functionTitle: string; // Gardien / Concierge, Agent d'entretien, Électricien, etc.
  assignedResidenceIds: string[];
  assignedBuildingIds: string[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  monthlySalary?: number;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  id: string;
  organizationId: string;
  residenceId: string;
  buildingId?: string;
  buildingName?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  status: TaskStatus;
  completedAt?: string;
  completionProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 8. Communications & Documents
// ==========================================

export interface Announcement {
  id: string;
  organizationId: string;
  residenceId: string;
  targetScope: 'ALL_RESIDENCE' | 'SPECIFIC_BUILDINGS';
  targetBuildingIds?: string[];
  title: string;
  content: string;
  category: 'GENERAL' | 'MAINTENANCE_ALERT' | 'WATER_CUT' | 'CHARGES_REMINDER';
  priority: 'NORMAL' | 'URGENT';
  publishedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  organizationId: string;
  residenceId: string;
  attachedToType: 'RESIDENCE' | 'BUILDING' | 'APARTMENT' | 'RESIDENT' | 'PAYMENT' | 'BILL' | 'EQUIPMENT';
  attachedToId: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedBy?: string;
  createdAt: string;
}

// ==========================================
// 9. Dashboard Aggregations & KPIs
// ==========================================

export interface DashboardMetrics {
  kpis: {
    totalResidences: number;
    totalBuildings: number;
    totalApartments: number;
    occupiedApartments: number;
    vacantApartments: number;
    occupancyRate: number; // percentage
    expectedChargesThisMonth: number; // DZD
    collectedChargesThisMonth: number; // DZD
    unpaidChargesThisMonth: number; // DZD
    collectionRate: number; // percentage
    totalOutstandingDebt: number; // cumulative DZD
    monthlyExpenses: number; // DZD
    openInterventionsCount: number;
    criticalIncidentsCount: number;
    equipmentOutOfServiceCount: number;
  };
  toHandle: {
    unpaidApartmentsCount: number;
    overdueBillsCount: number;
    urgentMaintenanceCount: number;
    criticalIncidentsCount: number;
    overdueTasksCount: number;
    failingEquipmentCount: number;
  };
  buildingsPerformance: {
    id: string;
    name: string;
    totalApartments: number;
    occupiedCount: number;
    collectionRate: number;
    unpaidAmount: number;
    openIssuesCount: number;
  }[];
  recentActivity: {
    id: string;
    type: 'PAYMENT' | 'INCIDENT' | 'MAINTENANCE' | 'EXPENSE' | 'ANNOUNCEMENT';
    title: string;
    subtitle: string;
    timestamp: string;
    amount?: number;
    severity?: PriorityLevel;
  }[];
}

// ==========================================
// 10. API Standard Responses
// ==========================================

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
