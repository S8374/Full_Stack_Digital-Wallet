import { model, Schema, Types } from "mongoose";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";
const authProviderSchema = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true }
}, {
  versionKey: false,
  _id: false
});
// Add agent request schema

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  phone: { type: String },
  picture: { type: String },
  address: { type: String },
  isDeleted: { type: Boolean, default: false },
  status: { type: String, enum: Object.values(UserStatus) },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: Object.values(Role) },
  auths: [authProviderSchema],
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for wallet
userSchema.virtual('wallet', {
  ref: 'Wallet',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
});
// Virtual for transactions (user initiated)
userSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'initiatedBy'
});

export const User = model<IUser>("User", userSchema);