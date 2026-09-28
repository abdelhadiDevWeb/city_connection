import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// Charge Definition Model
// ==========================================

export interface IChargeDefinitionDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  title: string;
  categoryTypeId?: mongoose.Types.ObjectId;
  categoryName?: string;
  amount: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME';
  appliesTo: 'ALL' | 'BUILDING' | 'APARTMENT';
  targetBuildingId?: mongoose.Types.ObjectId;
  targetApartmentId?: mongoose.Types.ObjectId;
  dueDay: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const ChargeDefinitionSchema = new Schema<IChargeDefinitionDocument>(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    categoryTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'LookupItem',
    },
    categoryName: {
      type: String,
      default: 'Charges Communes',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'ANNUAL', 'ONE_TIME'],
      default: 'MONTHLY',
    },
    appliesTo: {
      type: String,
      enum: ['ALL', 'BUILDING', 'APARTMENT'],
      default: 'ALL',
    },
    targetBuildingId: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
    },
    targetApartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    dueDay: {
      type: Number,
      default: 5,
      min: 1,
      max: 31,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
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

ChargeDefinitionSchema.index({ organizationId: 1, residenceId: 1, status: 1 });

export const ChargeDefinitionModel =
  mongoose.models.ChargeDefinition ||
  mongoose.model<IChargeDefinitionDocument>('ChargeDefinition', ChargeDefinitionSchema);

// ==========================================
// Payment Model
// ==========================================

export interface IPaymentDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  apartmentId: mongoose.Types.ObjectId;
  residentId?: mongoose.Types.ObjectId;
  chargeDefinitionId?: mongoose.Types.ObjectId;
  period: string; // "2026-03"
  amount: number;
  paymentDate: Date;
  paymentMethod: 'CASH' | 'CCP' | 'EDAHABIA' | 'CIB' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';
  transactionReference?: string;
  receiptNumber: string;
  proofDocumentUrl?: string;
  status: 'VALIDATED' | 'PENDING' | 'CANCELLED';
  collectedByUserId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
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
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
      index: true,
    },
    residentId: {
      type: Schema.Types.ObjectId,
      ref: 'ResidentProfile',
    },
    chargeDefinitionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChargeDefinition',
    },
    period: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CCP', 'EDAHABIA', 'CIB', 'CHEQUE', 'BANK_TRANSFER', 'OTHER'],
      default: 'CASH',
    },
    transactionReference: {
      type: String,
      trim: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      trim: true,
    },
    proofDocumentUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['VALIDATED', 'PENDING', 'CANCELLED'],
      default: 'VALIDATED',
      index: true,
    },
    collectedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
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

PaymentSchema.index({ organizationId: 1, receiptNumber: 1 }, { unique: true });
PaymentSchema.index({ residenceId: 1, apartmentId: 1, period: 1 });

export const PaymentModel =
  mongoose.models.Payment || mongoose.model<IPaymentDocument>('Payment', PaymentSchema);
