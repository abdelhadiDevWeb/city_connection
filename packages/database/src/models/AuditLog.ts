import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLogDocument extends Document {
  organizationId?: Types.ObjectId;
  actor: {
    id: Types.ObjectId;
    email: string;
    isSuperAdmin: boolean;
    ipAddress?: string;
    userAgent?: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
    },
    actor: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      email: { type: String, required: true },
      isSuperAdmin: { type: Boolean, default: false },
      ipAddress: { type: String },
      userAgent: { type: String },
    },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for querying organization audit logs sorted by time
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });

// TTL Index: Automatically expire audit logs after 365 days
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
