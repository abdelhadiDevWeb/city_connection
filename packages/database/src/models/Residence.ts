import mongoose, { Schema, Document } from 'mongoose';

export interface IResidenceDocument extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  typeId?: mongoose.Types.ObjectId;
  typeName?: string;
  wilaya: string;
  commune: string;
  address: string;
  totalBuildings: number;
  totalApartments: number;
  status: 'ACTIVE' | 'ARCHIVED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResidenceSchema = new Schema<IResidenceDocument>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    typeId: {
      type: Schema.Types.ObjectId,
      ref: 'LookupItem',
    },
    typeName: {
      type: String,
      default: 'Copropriété',
    },
    wilaya: {
      type: String,
      required: true,
      trim: true,
    },
    commune: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    totalBuildings: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalApartments: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
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

// Compound index for strict multi-tenant boundary
ResidenceSchema.index({ organizationId: 1, code: 1 }, { unique: true });
ResidenceSchema.index({ organizationId: 1, status: 1 });

export const ResidenceModel =
  mongoose.models.Residence || mongoose.model<IResidenceDocument>('Residence', ResidenceSchema);
