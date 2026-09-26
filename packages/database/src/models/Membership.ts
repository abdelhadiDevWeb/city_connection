import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMembershipDocument extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
  permissions: string[];
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembershipDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'MEMBER', 'GUEST'],
      default: 'MEMBER',
      required: true,
    },
    permissions: [{ type: String }],
    invitedAt: { type: Date },
    joinedAt: { type: Date, default: Date.now },
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

// Compound unique index ensuring a user cannot have duplicate memberships in the same organization
MembershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

// Compound index for querying members of an organization with role filtering
MembershipSchema.index({ organizationId: 1, role: 1 });

export const MembershipModel =
  mongoose.models.Membership || mongoose.model<IMembershipDocument>('Membership', MembershipSchema);
