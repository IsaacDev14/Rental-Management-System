import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  propertyId: mongoose.Types.ObjectId;
  category: string;
  description: string;
  amount: number;
  date: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
