import { Request, Response } from 'express';
import { Expense } from '../models/Expense';

// GET /api/expenses
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err });
  }
};

// GET /api/expenses/:id
export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expense', error: err });
  }
};

// POST /api/expenses
export const createExpense = async (req: Request, res: Response) => {
  try {
    const { propertyId, category, description, amount, date } = req.body;
    const expense = await Expense.create({
      propertyId,
      category,
      description,
      amount,
      date,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create expense', error: err });
  }
};

// PUT /api/expenses/:id
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update expense', error: err });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err });
  }
};
