import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganizationDocument extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  subscription: {
    tier: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
    status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
  };
  settings: {
    mfaEnforced: boolean;
    allowedDomains: string[];
    defaultRole: 'MEMBER' | 'GUEST';
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logoUrl: { type: String },
    subscription: {
      tier: {
        type: String,
        enum: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
        default: 'FREE',
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'],
        default: 'ACTIVE',
      },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
      currentPeriodEnd: { type: Date },
    },
    settings: {
      mfaEnforced: { type: Boolean, default: false },
      allowedDomains: [{ type: String }],
      defaultRole: {
        type: String,
        enum: ['MEMBER', 'GUEST'],
        default: 'MEMBER',
      },
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

export const OrganizationModel =
  mongoose.models.Organization || mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
