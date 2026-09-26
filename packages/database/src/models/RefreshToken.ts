import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  familyId: string; // Used to detect reuse & rotate token families
  isRevoked: boolean;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    userAgent: { type: String },
    ipAddress: { type: String },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// TTL Index: Document will be automatically purged by MongoDB when expiresAt is reached
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
