import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  mfaSecret?: string;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatarUrl: { type: String },
    isSuperAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mfaSecret: { type: String },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete (ret as { passwordHash?: string }).passwordHash;
        delete (ret as { mfaSecret?: string }).mfaSecret;
        ret.id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Partial index for Super Admins for fast lookup without ballooning index size
UserSchema.index(
  { isSuperAdmin: 1 },
  { partialFilterExpression: { isSuperAdmin: true } }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
