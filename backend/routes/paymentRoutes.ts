import express from 'express';
import { getPayments, addPayment, updatePayment, deletePayment } from '../controllers/paymentController';

const router = express.Router();

// Removed optional param from route path to fix path-to-regexp error
// Use query parameter landlordId to filter if needed

router.get('/', getPayments);        // Fetch all payments, optionally filtered by ?landlordId=xxx
router.post('/', addPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

export default router;
