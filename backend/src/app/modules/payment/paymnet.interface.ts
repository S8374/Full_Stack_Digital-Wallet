import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export enum PAYMENT_TYPE {
    ADD_MONEY = "ADD_MONEY",
    SEND_MONEY = "SEND_MONEY",
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT",
    WITHDRAW = "WITHDRAW"
}

export interface IPayment {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    type: PAYMENT_TYPE;
    amount: number;
    status: PAYMENT_STATUS;
    transactionId: string;
    paymentGatewayData?: any;
    toUserId?: Types.ObjectId;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    walletId?: Types.ObjectId;
    transactionID?: Types.ObjectId;
    fromUserId?: Types.ObjectId;
    invoiceUrl?: string;
}