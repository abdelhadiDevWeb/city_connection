import mongoose, { Schema, Document } from 'mongoose';

export interface ILookupItemDocument extends Document {
  organizationId?: mongoose.Types.ObjectId;
  group:
    | 'RESIDENCE_TYPE'
    | 'CHARGE_TYPE'
    | 'PAYMENT_METHOD'
    | 'EXPENSE_CATEGORY'
    | 'BILL_TYPE'
    | 'INCIDENT_TYPE'
    | 'EQUIPMENT_TYPE'
    | 'STAFF_FUNCTION'
    | 'DOCUMENT_CATEGORY';
  code: string;
  label: {
    fr: string;
    ar?: string;
    en?: string;
  };
  isSystem: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LookupItemSchema = new Schema<ILookupItemDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
    },
    group: {
      type: String,
      enum: [
        'RESIDENCE_TYPE',
        'CHARGE_TYPE',
        'PAYMENT_METHOD',
        'EXPENSE_CATEGORY',
        'BILL_TYPE',
        'INCIDENT_TYPE',
        'EQUIPMENT_TYPE',
        'STAFF_FUNCTION',
        'DOCUMENT_CATEGORY',
      ],
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    label: {
      fr: { type: String, required: true },
      ar: { type: String },
      en: { type: String },
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

LookupItemSchema.index({ group: 1, code: 1, organizationId: 1 }, { unique: true });

export const LookupItemModel =
  mongoose.models.LookupItem || mongoose.model<ILookupItemDocument>('LookupItem', LookupItemSchema);
