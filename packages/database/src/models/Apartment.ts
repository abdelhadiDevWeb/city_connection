import mongoose, { Schema, Document } from 'mongoose';

export interface IApartmentDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId;
  number: string;
  floor: number;
  type: string;
  surfaceM2?: number;
  occupancyStatus: 'OCCUPIED' | 'VACANT' | 'UNDER_MAINTENANCE';
  currentResidentId?: mongoose.Types.ObjectId;
  monthlyChargeAmount: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApartmentSchema = new Schema<IApartmentDocument>(
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
      required: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      default: 'F3',
      trim: true,
    },
    surfaceM2: {
      type: Number,
    },
    occupancyStatus: {
      type: String,
      enum: ['OCCUPIED', 'VACANT', 'UNDER_MAINTENANCE'],
      default: 'VACANT',
      index: true,
    },
    currentResidentId: {
      type: Schema.Types.ObjectId,
      ref: 'ResidentProfile',
    },
    monthlyChargeAmount: {
      type: Number,
      default: 2000,
      min: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
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

ApartmentSchema.index({ buildingId: 1, number: 1 }, { unique: true });
ApartmentSchema.index({ residenceId: 1, occupancyStatus: 1 });
ApartmentSchema.index({ organizationId: 1, residenceId: 1, currentBalance: 1 });

export const ApartmentModel =
  mongoose.models.Apartment || mongoose.model<IApartmentDocument>('Apartment', ApartmentSchema);
