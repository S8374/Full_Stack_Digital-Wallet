// src/modules/moneyRequest/moneyRequest.interface.ts
import { Types } from "mongoose";
import { TransactionStatus } from "../transaction/transaction.interface";

export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled"
}

export interface IMoneyRequest {
  _id: Types.ObjectId;
  fromUser: Types.ObjectId; // User who is requesting money
  toUser: Types.ObjectId;   // User who will send money
  amount: number;
  description?: string;
  status: RequestStatus;
  transactionId?: Types.ObjectId; // Reference to transaction if approved
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMoneyRequest {
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  amount: number;
  description?: string;
}