import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  tenantId: string;
  propertyId: string;
  unitId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    propertyId: { type: String, required: true },
    unitId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
