const Tenant = require('../models/Tenant');
const Property = require('../models/Property');

exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('propertyId unitId');
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const newTenant = await Tenant.create(req.body);

    // Assign tenant to unit
    await Property.updateOne(
      { _id: newTenant.propertyId, 'units._id': newTenant.unitId },
      { $set: { 'units.$.tenantId': newTenant._id } }
    );

    res.status(201).json(newTenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
};

exports.updateTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findById(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    const oldUnitId = tenant.unitId;
    const updatedTenant = await Tenant.findByIdAndUpdate(id, req.body, { new: true });

    // Remove from old unit if changed
    if (oldUnitId.toString() !== req.body.unitId) {
      await Property.updateOne(
        { _id: tenant.propertyId, 'units._id': oldUnitId },
        { $set: { 'units.$.tenantId': null } }
      );

      await Property.updateOne(
        { _id: updatedTenant.propertyId, 'units._id': updatedTenant.unitId },
        { $set: { 'units.$.tenantId': updatedTenant._id } }
      );
    }

    res.json(updatedTenant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};

exports.deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findByIdAndDelete(id);

    if (tenant) {
      await Property.updateOne(
        { _id: tenant.propertyId, 'units._id': tenant.unitId },
        { $set: { 'units.$.tenantId': null } }
      );
    }

    res.json({ message: 'Tenant deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
};
