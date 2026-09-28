import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// Expense Model
// ==========================================

export interface IExpenseDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  expenseDate: Date;
  supplierName: string;
  supplierPhone?: string;
  paymentMethod: 'CASH' | 'CCP' | 'EDAHABIA' | 'CIB' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';
  receiptUrl?: string;
  description?: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDocument>(
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
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },
    supplierPhone: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'CCP', 'EDAHABIA', 'CIB', 'CHEQUE', 'BANK_TRANSFER', 'OTHER'],
      default: 'CASH',
    },
    receiptUrl: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PAID', 'PENDING', 'CANCELLED'],
      default: 'PAID',
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

ExpenseSchema.index({ residenceId: 1, expenseDate: -1 });

export const ExpenseModel =
  mongoose.models.Expense || mongoose.model<IExpenseDocument>('Expense', ExpenseSchema);

// ==========================================
// Bill Model (Utility / Contractual)
// ==========================================

export interface IBillDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId?: mongoose.Types.ObjectId;
  serviceType: 'ELECTRICITY' | 'WATER' | 'GAS' | 'ELEVATOR_CONTRACT' | 'SECURITY' | 'CLEANING' | 'OTHER';
  providerName: string;
  referenceNumber: string;
  billingPeriod: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
  documentUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<IBillDocument>(
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
    serviceType: {
      type: String,
      enum: ['ELECTRICITY', 'WATER', 'GAS', 'ELEVATOR_CONTRACT', 'SECURITY', 'CLEANING', 'OTHER'],
      required: true,
    },
    providerName: {
      type: String,
      required: true,
      trim: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    billingPeriod: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    paymentDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['UNPAID', 'PAID', 'OVERDUE'],
      default: 'UNPAID',
      index: true,
    },
    documentUrl: {
      type: String,
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

BillSchema.index({ residenceId: 1, status: 1, dueDate: 1 });

export const BillModel =
  mongoose.models.Bill || mongoose.model<IBillDocument>('Bill', BillSchema);
