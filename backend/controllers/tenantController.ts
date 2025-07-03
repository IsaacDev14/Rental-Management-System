import { Request, Response } from 'express';
import Tenant from '../models/Tenant';

export const getTenants = async (_req: Request, res: Response) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

export const createTenant = async (req: Request, res: Response) => {
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
      return res.status(400).json({
        error: 'Missing required tenant fields',
        body: req.body,
      });
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
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to create tenant',
      details: error.message,
    });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const updated = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tenant' });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tenant' });
  }
};
