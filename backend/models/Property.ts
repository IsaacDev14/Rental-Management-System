import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rent: { type: Number, required: true },
  type: { type: String, enum: ['residential', 'commercial'], default: 'residential' },
  tenantId: { type: String, default: null },
});

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    landlordId: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    units: [UnitSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model('Property', PropertySchema);
