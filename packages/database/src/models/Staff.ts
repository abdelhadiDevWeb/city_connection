import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// StaffMember Model
// ==========================================

export interface IStaffMemberDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  functionTitle: string;
  assignedResidenceIds: mongoose.Types.ObjectId[];
  assignedBuildingIds: mongoose.Types.ObjectId[];
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  monthlySalary?: number;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffMemberSchema = new Schema<IStaffMemberDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    functionTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    assignedResidenceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Residence',
      },
    ],
    assignedBuildingIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'TERMINATED'],
      default: 'ACTIVE',
      index: true,
    },
    monthlySalary: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
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

StaffMemberSchema.index({ organizationId: 1, status: 1 });

export const StaffMemberModel =
  mongoose.models.StaffMember ||
  mongoose.model<IStaffMemberDocument>('StaffMember', StaffMemberSchema);

// ==========================================
// Task Model (Daily operational work)
// ==========================================

export interface ITaskDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  assignedStaffId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  deadline?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt?: Date;
  completionProofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
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
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: 'StaffMember',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
    },
    deadline: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    completedAt: {
      type: Date,
    },
    completionProofUrl: {
      type: String,
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

TaskSchema.index({ residenceId: 1, status: 1 });

export const TaskModel =
  mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);
