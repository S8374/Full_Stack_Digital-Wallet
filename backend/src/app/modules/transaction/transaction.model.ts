import { model, Schema } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
  type: { 
    type: String, 
    enum: Object.values(TransactionType), 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  fee: { 
    type: Number, 
    default: 0 
  },
  commission: { 
    type: Number, 
    default: 0 
  },
  netAmount: { 
    type: Number, 
    required: true 
  },
  fromWallet: { 
    type: Schema.Types.ObjectId, 
    ref: "Wallet", 
    required: true 
  },
  toWallet: { 
    type: Schema.Types.ObjectId, 
    ref: "Wallet" 
  },
  initiatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  processedBy: { 
    type: Schema.Types.ObjectId, 
    ref: "User" 
  },
  status: { 
    type: String, 
    enum: Object.values(TransactionStatus), 
    default: TransactionStatus.PENDING 
  },
  description: { 
    type: String 
  },
  reference: { 
    type: String, 
    required: true, 
    unique: true 
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ fromWallet: 1, createdAt: -1 });
transactionSchema.index({ toWallet: 1, createdAt: -1 });
transactionSchema.index({ initiatedBy: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });

export const Transaction = model<ITransaction>("Transaction", transactionSchema);