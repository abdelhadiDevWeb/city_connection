import mongoose, { Schema, Document } from 'mongoose';

export interface IResidentProfileDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId;
  apartmentId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  email?: string;
  residentType: 'OWNER' | 'TENANT';
  occupancyStartDate: Date;
  occupancyEndDate?: Date;
  notes?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const ResidentProfileSchema = new Schema<IResidentProfileDocument>(
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
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    residentType: {
      type: String,
      enum: ['OWNER', 'TENANT'],
      default: 'OWNER',
    },
    occupancyStartDate: {
      type: Date,
      default: Date.now,
    },
    occupancyEndDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
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

ResidentProfileSchema.index({ organizationId: 1, phone: 1 });
ResidentProfileSchema.index({ residenceId: 1, apartmentId: 1, status: 1 });

export const ResidentProfileModel =
  mongoose.models.ResidentProfile ||
  mongoose.model<IResidentProfileDocument>('ResidentProfile', ResidentProfileSchema);
