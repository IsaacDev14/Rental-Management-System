import type { Request, Response } from 'express';
import Property from '../models/Property';

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const landlordId = req.params.landlordId;
    const properties = await Property.find({ landlordId });
    res.json(properties);
  } catch (err: unknown) {
    console.error('Error fetching properties:', getErrorMessage(err));
    res.status(500).json({ error: 'Failed to fetch properties', details: getErrorMessage(err) });
  }
};

export const addProperty = async (req: Request, res: Response) => {
  try {
    const newProperty = new Property(req.body);
    const saved = await newProperty.save();
    res.status(201).json(saved);
  } catch (err: unknown) {
    console.error('Error adding property:', getErrorMessage(err));
    res.status(400).json({ error: 'Failed to add property', details: getErrorMessage(err) });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Property.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Property not found' });
    res.json(updated);
  } catch (err: unknown) {
    console.error('Error updating property:', getErrorMessage(err));
    res.status(400).json({ error: 'Failed to update property', details: getErrorMessage(err) });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err: unknown) {
    console.error('Error deleting property:', getErrorMessage(err));
    res.status(500).json({ error: 'Failed to delete property', details: getErrorMessage(err) });
  }
};
