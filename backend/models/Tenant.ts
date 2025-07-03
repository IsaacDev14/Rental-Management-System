import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  email: string;
  phone: string;
  leaseStart: Date;
  leaseEnd: Date;
  propertyId: mongoose.Types.ObjectId;
  unitId: string; // 🔁 Changed from ObjectId to string
}

const tenantSchema = new Schema<ITenant>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  leaseStart: { type: Date, required: true },
  leaseEnd: { type: Date, required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  unitId: { type: String, required: true }, // 🔁 updated
}, { timestamps: true });

tenantSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model<ITenant>('Tenant', tenantSchema);
