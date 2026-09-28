import mongoose, { Schema, Document } from 'mongoose';

export interface IBuildingDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  residenceId: mongoose.Types.ObjectId;
  name: string;
  floorsCount: number;
  apartmentsCount: number;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const BuildingSchema = new Schema<IBuildingDocument>(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floorsCount: {
      type: Number,
      required: true,
      default: 5,
      min: 1,
    },
    apartmentsCount: {
      type: Number,
      required: true,
      default: 20,
      min: 1,
    },
    description: {
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

BuildingSchema.index({ residenceId: 1, name: 1 }, { unique: true });
BuildingSchema.index({ organizationId: 1, residenceId: 1, status: 1 });

export const BuildingModel =
  mongoose.models.Building || mongoose.model<IBuildingDocument>('Building', BuildingSchema);
