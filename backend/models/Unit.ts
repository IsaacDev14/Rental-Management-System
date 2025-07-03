import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Single', 'Double', 'Bedsitter', '1 Bedroom', '2 Bedroom'],
    default: 'Single',
  },
  rent: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  tenantId: {
    type: String, // You can use ObjectId if referencing Tenant directly
    default: null,
  }
}, { timestamps: true });

module.exports = UnitSchema;
