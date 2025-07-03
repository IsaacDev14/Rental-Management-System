import type { Request, Response } from 'express';
import Tenant from '../models/Tenant';
import Property from '../models/Property';

const getError = (e: unknown) => (e instanceof Error ? e.message : 'Unknown');

export const getTenants = async (_: Request, res: Response) => {
  try {
    const tenants = await Tenant.find().lean();
    res.json(tenants);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tenants', details: getError(e) });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    const tenant = await Tenant.create(req.body);
    await Property.updateOne(
      { _id: tenant.propertyId, 'units.id': req.body.unitId },
      { $set: { 'units.$.tenantId': tenant.id } }
    );
    res.status(201).json(tenant);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create tenant', details: getError(e) });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const old = await Tenant.findById(id);
    if (!old) return res.status(404).json({ error: 'Tenant not found' });
    const updated = await Tenant.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) throw new Error('Failed to update');

    if (old.unitId.toString() !== req.body.unitId) {
      await Property.updateOne(
        { _id: old.propertyId, 'units.id': old.unitId },
        { $set: { 'units.$.tenantId': null } }
      );
      await Property.updateOne(
        { _id: updated.propertyId, 'units.id': updated.unitId },
        { $set: { 'units.$.tenantId': updated.id } }
      );
    }

    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update tenant', details: getError(e) });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByIdAndDelete(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    await Property.updateOne(
      { _id: tenant.propertyId, 'units.id': tenant.unitId },
      { $set: { 'units.$.tenantId': null } }
    );

    res.json({ message: 'Tenant deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete tenant', details: getError(e) });
  }
};
