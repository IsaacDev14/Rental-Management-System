import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  name: String,
  type: String,
  rent: Number,
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    default: null
  }
});

const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  units: [unitSchema]
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
