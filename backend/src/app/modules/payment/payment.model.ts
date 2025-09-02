// src/modules/payment/payment.model.ts
import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS, PAYMENT_TYPE } from "./paymnet.interface";

const paymentSchema = new Schema<IPayment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // Changed from "users" to "User"
        required: true,
        // REMOVED: unique: true - This was causing the error
    },
    type: {
        type: String,
        enum: Object.values(PAYMENT_TYPE),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true, // This should remain unique
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentGatewayData: {
        type: Schema.Types.Mixed
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: "Wallet"  
    },
    transactionID: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    },
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Changed from "users" to "User"
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User" // Changed from "users" to "User"
    },
    invoiceUrl: {
        type: String
    }
}, {
    timestamps: true
});

// Add proper indexes (optional but recommended)
paymentSchema.index({ userId: 1, createdAt: -1 }); // For querying user payments
paymentSchema.index({ transactionId: 1 }, { unique: true }); // Ensure unique transaction IDs

export const Payment = model<IPayment>("Payment", paymentSchema);