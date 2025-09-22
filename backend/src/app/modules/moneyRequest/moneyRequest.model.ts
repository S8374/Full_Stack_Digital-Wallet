// src/modules/moneyRequest/moneyRequest.model.ts
import { model, Schema } from "mongoose";
import { IMoneyRequest, RequestStatus } from "./moneyRequest.interface";

const moneyRequestSchema = new Schema<IMoneyRequest>({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
moneyRequestSchema.index({ fromUser: 1, status: 1 });
moneyRequestSchema.index({ toUser: 1, status: 1 });
moneyRequestSchema.index({ createdAt: -1 });

export const MoneyRequest = model<IMoneyRequest>("MoneyRequest", moneyRequestSchema);