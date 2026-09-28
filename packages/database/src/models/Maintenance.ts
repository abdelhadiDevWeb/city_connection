import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// Equipment Model
// ==========================================

export interface IEquipmentDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  name: string;
  type: string;
  brandModel?: string;
  serialNumber?: string;
  installationDate?: Date;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUT_OF_SERVICE' | 'UNDER_MAINTENANCE';
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  providerName?: string;
  providerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipmentDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    residenceId: {
      type: Schema.Types.ObjectId,
      ref: 'Residence',
      required: true,
      index: true,
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    brandModel: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    installationDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['OPERATIONAL', 'DEGRADED', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE'],
      default: 'OPERATIONAL',
      index: true,
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceDate: {
      type: Date,
      index: true,
    },
    providerName: {
      type: String,
      trim: true,
    },
    providerPhone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

EquipmentSchema.index({ residenceId: 1, status: 1 });

export const EquipmentModel =
  mongoose.models.Equipment || mongoose.model<IEquipmentDocument>('Equipment', EquipmentSchema);

// ==========================================
// Incident Model
// ==========================================

export interface IIncidentDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  apartmentId?: mongoose.Types.ObjectId;
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  reporterName: string;
  reporterPhone?: string;
  mediaUrls: string[];
  status: 'REPORTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionDetails?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncidentDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    residenceId: {
      type: Schema.Types.ObjectId,
      ref: 'Residence',
      required: true,
      index: true,
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
    },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    reporterPhone: {
      type: String,
      trim: true,
    },
    mediaUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['REPORTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'REPORTED',
      index: true,
    },
    resolutionDetails: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

IncidentSchema.index({ residenceId: 1, status: 1, priority: 1 });

export const IncidentModel =
  mongoose.models.Incident || mongoose.model<IIncidentDocument>('Incident', IncidentSchema);

// ==========================================
// Intervention Model (Maintenance Tickets)
// ==========================================

export interface IInterventionDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  incidentId?: mongoose.Types.ObjectId;
  equipmentId?: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assignedStaffId?: mongoose.Types.ObjectId;
  externalProvider?: string;
  externalProviderPhone?: string;
  cost: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'RESOLVED' | 'CLOSED';
  photosBefore: string[];
  photosAfter: string[];
  scheduledDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterventionSchema = new Schema<IInterventionDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    residenceId: {
      type: Schema.Types.ObjectId,
      ref: 'Residence',
      required: true,
      index: true,
    },
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: 'Incident',
    },
    equipmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Equipment',
    },
    buildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: 'StaffMember',
    },
    externalProvider: {
      type: String,
      trim: true,
    },
    externalProviderPhone: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    photosBefore: [{ type: String }],
    photosAfter: [{ type: String }],
    scheduledDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

InterventionSchema.index({ residenceId: 1, status: 1 });

export const InterventionModel =
  mongoose.models.Intervention ||
  mongoose.model<IInterventionDocument>('Intervention', InterventionSchema);
