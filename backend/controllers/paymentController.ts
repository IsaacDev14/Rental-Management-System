import { Request, Response } from 'express';
import Payment from '../models/Payment';

// Get all payments (optionally filtered by landlordId via query param)
export const getPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const landlordId = req.query.landlordId as string | undefined;

    let payments;

    if (landlordId) {
      // Implement actual filtering if needed (e.g. join properties -> tenants -> payments)
      payments = await Payment.find().sort({ paymentDate: -1 });
    } else {
      payments = await Payment.find().sort({ paymentDate: -1 });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Get Payments Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add new payment
export const addPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentData = req.body;
    const newPayment = new Payment(paymentData);
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Add Payment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update payment by ID
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.id;
    const updated = await Payment.findByIdAndUpdate(paymentId, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Update Payment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete payment by ID
export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const paymentId = req.params.id;
    const deleted = await Payment.findByIdAndDelete(paymentId);
    if (!deleted) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.status(200).json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('Delete Payment Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
