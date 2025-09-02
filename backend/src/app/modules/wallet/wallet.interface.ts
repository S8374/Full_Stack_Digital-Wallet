import { Document } from "mongoose";
import { Model } from "mongoose";
import { Types } from "mongoose";

export enum WalletStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  INACTIVE = "inactive"
}

export enum WalletType {
  USER = "user",
  AGENT = "agent",
  SYSTEM = "system"
}

export interface IWallet extends Document  {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  currency: string;
  status: WalletStatus;
  type: WalletType;
  minBalance: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailySpent: number;
  monthlySpent: number;
  lastResetDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
// Static methods interface
export interface IWalletModel extends Model<IWallet> {
  checkAndResetLimits(walletId: Types.ObjectId): Promise<IWallet>;
}