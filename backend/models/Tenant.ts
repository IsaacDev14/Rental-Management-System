import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  leaseStart: { type: Date, required: true },
  leaseEnd: { type: Date, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

tenantSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model('Tenant', tenantSchema);
