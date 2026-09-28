import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// Announcement Model
// ==========================================

export interface IAnnouncementDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  targetScope: 'ALL_RESIDENCE' | 'SPECIFIC_BUILDINGS';
  targetBuildingIds: mongoose.Types.ObjectId[];
  title: string;
  content: string;
  category: 'GENERAL' | 'MAINTENANCE_ALERT' | 'WATER_CUT' | 'CHARGES_REMINDER';
  priority: 'NORMAL' | 'URGENT';
  publishedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncementDocument>(
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
    targetScope: {
      type: String,
      enum: ['ALL_RESIDENCE', 'SPECIFIC_BUILDINGS'],
      default: 'ALL_RESIDENCE',
    },
    targetBuildingIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Building',
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['GENERAL', 'MAINTENANCE_ALERT', 'WATER_CUT', 'CHARGES_REMINDER'],
      default: 'GENERAL',
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'URGENT'],
      default: 'NORMAL',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
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

AnnouncementSchema.index({ residenceId: 1, publishedAt: -1 });

export const AnnouncementModel =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncementDocument>('Announcement', AnnouncementSchema);

// ==========================================
// DocumentItem Model
// ==========================================

export interface IDocumentItemDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  attachedToType: 'RESIDENCE' | 'BUILDING' | 'APARTMENT' | 'RESIDENT' | 'PAYMENT' | 'BILL' | 'EQUIPMENT';
  attachedToId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DocumentItemSchema = new Schema<IDocumentItemDocument>(
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
    attachedToType: {
      type: String,
      enum: ['RESIDENCE', 'BUILDING', 'APARTMENT', 'RESIDENT', 'PAYMENT', 'BILL', 'EQUIPMENT'],
      required: true,
    },
    attachedToId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

DocumentItemSchema.index({ residenceId: 1, attachedToType: 1, attachedToId: 1 });

export const DocumentItemModel =
  mongoose.models.DocumentItem ||
  mongoose.model<IDocumentItemDocument>('DocumentItem', DocumentItemSchema);
