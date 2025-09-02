import { Types } from "mongoose";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
  CASH_IN = "cash_in",
  CASH_OUT = "cash_out",
  FEE = "fee",
  COMMISSION = "commission"
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed"
}

export interface ITransaction {
  _id: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fee: number;
  commission: number;
  netAmount: number;
  fromWallet: Types.ObjectId;
  toWallet?: Types.ObjectId;
  initiatedBy: Types.ObjectId;
  processedBy?: Types.ObjectId; // For agent transactions
  status: TransactionStatus;
  description?: string;
  reference: string;
  createdAt?: Date;
  updatedAt?: Date;
}