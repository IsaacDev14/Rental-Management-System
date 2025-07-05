import { Request, Response } from 'express';
import Tenant from '../models/Tenant';

// Get all tenants
export const getTenants = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

// Create a new tenant
export const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      leaseStart,
      leaseEnd,
      propertyId,
      unitId,
    } = req.body;

    if (!name || !email || !phone || !leaseStart || !leaseEnd || !propertyId || !unitId) {
      res.status(400).json({
        error: 'Missing required tenant fields',
        body: req.body,
      });
      return;
    }

    const newTenant = new Tenant({
      name,
      email,
      phone,
      leaseStart: new Date(leaseStart),
      leaseEnd: new Date(leaseEnd),
      propertyId,
      unitId,
    });

    const savedTenant = await newTenant.save();
    res.status(201).json(savedTenant);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({
      error: 'Failed to create tenant',
      details: message,
    });
  }
};

// Update tenant
export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update tenant' });
  }
};

// Delete tenant
export const deleteTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(400).json({ error: 'Failed to delete tenant' });
  }
};
