import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'landlord' | 'tenant' | 'kra_officer';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole; // ✅ Add role here
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ['landlord', 'tenant', 'kra_officer'], // ✅ Add enum for validation
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
