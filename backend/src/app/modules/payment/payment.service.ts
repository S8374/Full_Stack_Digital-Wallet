// src/modules/payment/payment.service.ts
import httpStatus from "http-status";
import { Payment } from "./payment.model";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "./paymnet.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import { SSLService } from "../sslCommerz/sslcommerz.service";
import { generatePaymentInvoicePdf, IPaymentInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";

const initPayment = async (
    userId: string,
    toUserId: string,
    amount: number,
    type: PAYMENT_TYPE
) => {


    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${uuidv4().substr(0, 8)}`;

    // Create payment record
    const payment = await Payment.create({
        userId,
        toUserId: toUserId ? new mongoose.Types.ObjectId(toUserId) : undefined,
        amount,
        type,
        status: PAYMENT_STATUS.PENDING,
        transactionId,
    });

    const userAddress = user.address || "N/A";
    const userEmail = user.email;
    const userPhoneNumber = user.phone || "01711111111";
    const userName = user.name;

    const sslPayload = {
        amount: amount,
        transactionId: transactionId,
        name: userName,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        address: userAddress,
        type: type
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload, payment._id.toString());

    // Update payment with gateway data
    await Payment.findByIdAndUpdate(payment._id, {
        paymentGatewayData: sslPayment,
        invoiceUrl: sslPayment.GatewayPageURL
    });

    return {
        paymentId: payment._id,
        paymentUrl: sslPayment.GatewayPageURL,
        transactionId: transactionId
    };
};

const successPayment = async (query: Record<string, string>) => {
    const { tran_id, val_id, paymentRequestId } = query;

    // Validate payment with SSLCommerz if val_id is provided
    if (val_id) {
        try {
            const validationResult = await SSLService.validatePayment({ val_id });
            console.log("Payment validation result:", validationResult);
        } catch (error) {
            console.error("Payment validation failed:", error);
            // Continue processing even if validation fails for now
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // First try to find by transactionId
        let payment = await Payment.findOne({ transactionId: tran_id }).session(session);

        // If not found by transactionId, try to find by paymentRequestId (for retried payments)
        if (!payment && paymentRequestId) {
            payment = await Payment.findById(paymentRequestId).session(session);

            // Verify that the transactionId matches the current payment's transactionId
            if (payment && payment.transactionId !== tran_id) {
                throw new AppError(httpStatus.BAD_REQUEST, "Transaction ID mismatch");
            }
        }

        if (!payment) {
            throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
        }

        // Check if payment is already processed
        if (payment.status === PAYMENT_STATUS.PAID) {
            await session.commitTransaction();
            session.endSession();
            return {
                success: true,
                message: "Payment was already processed successfully"
            };
        }

        // Update payment status
        const updatedPayment = await Payment.findOneAndUpdate(
            { _id: payment._id },
            {
                status: PAYMENT_STATUS.PAID,
                paymentGatewayData: { ...payment.paymentGatewayData, validationData: query }
            },
            { new: true, session }
        );

        // Create transaction based on payment type
        let transaction;
        switch (payment.type) {
            case PAYMENT_TYPE.ADD_MONEY:
                transaction = await handleAddMoney(payment, session);
                break;
            case PAYMENT_TYPE.SEND_MONEY:
                transaction = await handleSendMoney(payment, session);
                break;
            case PAYMENT_TYPE.CASH_IN:
                transaction = await handleCashIn(payment, session);
                break;
            case PAYMENT_TYPE.CASH_OUT:
                transaction = await handleCashOut(payment, session);
                break;
            case PAYMENT_TYPE.WITHDRAW:
                transaction = await handleWithdraw(payment, session);
                break;
            default:
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment type");
        }

        // Update payment with transaction ID
        await Payment.findByIdAndUpdate(
            payment._id,
            { transactionID: transaction._id },
            { session }
        );

        // Get user details for email
        const user = await User.findById(payment.userId);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found for email");
        }

        // COMMIT THE TRANSACTION FIRST to ensure wallet balance is updated
        await session.commitTransaction();
        session.endSession();

        // NOW get the updated wallet balance after the transaction is committed
        const wallet = await Wallet.findOne({ userId: payment.userId });
        const walletBalance = wallet ? wallet.balance : undefined;

        // Prepare invoice data
        const invoiceData: IPaymentInvoiceData = {
            transactionId: payment.transactionId,
            paymentDate: new Date(),
            userName: user.name,
            userEmail: user.email,
            paymentType: payment.type,
            amount: payment.amount,
            status: PAYMENT_STATUS.PAID,
            reference: `Payment-${payment._id}`,
            paymentMethod: "SSLCommerz",
            walletBalance: walletBalance
        };

        // Generate PDF invoice
        const pdfBuffer = await generatePaymentInvoicePdf(invoiceData);

        // Send email with PDF attachment
        await sendEmail({
            to: user.email,
            subject: `Payment Confirmation - ${payment.transactionId}`,
            templateName: 'payment-invoice',
            templateData: invoiceData,
            attachments: [
                {
                    filename: `invoice-${payment.transactionId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        return {
            success: true,
            message: "Payment Completed Successfully. Invoice sent to your email.",
            transactionId: transaction._id
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        // Update payment status to failed in case of error
        await Payment.findOneAndUpdate(
            { transactionId: tran_id },
            { status: PAYMENT_STATUS.FAILED }
        );

        console.error("Payment processing error:", error);
        throw error;
    }
};
const handleAddMoney = async (payment: any, session: mongoose.ClientSession) => {
    const wallet = await Wallet.findOne({ userId: payment.userId }).session(session);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Update wallet balance
    await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: payment.amount } },
        { session }
    );

    // Create transaction
    const transaction = await Transaction.create([{
        type: TransactionType.DEPOSIT,
        amount: payment.amount,
        fee: 0,
        commission: 0,
        netAmount: payment.amount,
        fromWallet: wallet._id,
        toWallet: wallet._id,
        initiatedBy: payment.userId,
        status: TransactionStatus.COMPLETED,
        description: `Money added to wallet via payment`,
        reference: payment.transactionId
    }], { session });

    return transaction[0];
};

const handleWithdraw = async (payment: any, session: mongoose.ClientSession) => {
    const wallet = await Wallet.findOne({ userId: payment.userId }).session(session);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Check sufficient balance
    if (wallet.balance < payment.amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance for withdrawal");
    }

    // Update wallet balance (deduct amount)
    await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: -payment.amount } },
        { session }
    );

    // Create transaction record for withdrawal
    const transaction = await Transaction.create([{
        type: TransactionType.WITHDRAWAL,
        amount: payment.amount,
        fee: 0, // You might want to add withdrawal fees
        commission: 0,
        netAmount: payment.amount,
        fromWallet: wallet._id,
        initiatedBy: payment.userId,
        status: TransactionStatus.COMPLETED,
        description: `Money withdrawn from wallet via payment`,
        reference: payment.transactionId
    }], { session });

    return transaction[0];
};

const handleSendMoney = async (payment: any, session: mongoose.ClientSession) => {
    if (!payment.toUserId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Recipient not specified");
    }

    const fromWallet = await Wallet.findOne({ userId: payment.userId }).session(session);
    const toWallet = await Wallet.findOne({ userId: payment.toUserId }).session(session);

    if (!fromWallet || !toWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Calculate fee (1% of amount, min 5 BDT, max 50 BDT)
    const fee = Math.min(Math.max(payment.amount * 0.01, 5), 50);
    const netAmount = payment.amount - fee;

    // Update sender wallet
    await Wallet.findByIdAndUpdate(
        fromWallet._id,
        { $inc: { balance: -payment.amount } },
        { session }
    );

    // Update recipient wallet
    await Wallet.findByIdAndUpdate(
        toWallet._id,
        { $inc: { balance: netAmount } },
        { session }
    );

    // Create transaction
    const transaction = await Transaction.create([{
        type: TransactionType.TRANSFER,
        amount: payment.amount,
        fee: fee,
        commission: 0,
        netAmount: netAmount,
        fromWallet: fromWallet._id,
        toWallet: toWallet._id,
        initiatedBy: payment.userId,
        status: TransactionStatus.COMPLETED,
        description: `Money sent to user`,
        reference: payment.transactionId
    }], { session });

    return transaction[0];
};

const handleCashIn = async (payment: any, session: mongoose.ClientSession) => {
    if (!payment.toUserId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Recipient not specified");
    }

    const agentWallet = await Wallet.findOne({
        userId: payment.userId,
        type: "agent"
    }).session(session);

    const userWallet = await Wallet.findOne({
        userId: payment.toUserId,
        type: "user"
    }).session(session);

    if (!agentWallet || !userWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Calculate commission (1.5% of amount)
    const commission = payment.amount * 0.015;
    const netAmount = payment.amount - commission;

    // Update agent wallet
    await Wallet.findByIdAndUpdate(
        agentWallet._id,
        { $inc: { balance: -payment.amount + commission } },
        { session }
    );

    // Update user wallet
    await Wallet.findByIdAndUpdate(
        userWallet._id,
        { $inc: { balance: netAmount } },
        { session }
    );

    // Create transaction
    const transaction = await Transaction.create([{
        type: TransactionType.CASH_IN,
        amount: payment.amount,
        fee: 0,
        commission: commission,
        netAmount: netAmount,
        fromWallet: agentWallet._id,
        toWallet: userWallet._id,
        initiatedBy: payment.userId,
        processedBy: payment.userId,
        status: TransactionStatus.COMPLETED,
        description: `Cash-in by agent`,
        reference: payment.transactionId
    }], { session });

    return transaction[0];
};

const handleCashOut = async (payment: any, session: mongoose.ClientSession) => {
    if (!payment.toUserId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Recipient not specified");
    }

    const userWallet = await Wallet.findOne({
        userId: payment.userId,
        type: "user"
    }).session(session);

    const agentWallet = await Wallet.findOne({
        userId: payment.toUserId,
        type: "agent"
    }).session(session);

    if (!userWallet || !agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    // Calculate commission (1.5% of amount)
    const commission = payment.amount * 0.015;
    const netAmount = payment.amount - commission;

    // Update user wallet
    await Wallet.findByIdAndUpdate(
        userWallet._id,
        { $inc: { balance: -payment.amount } },
        { session }
    );

    // Update agent wallet
    await Wallet.findByIdAndUpdate(
        agentWallet._id,
        { $inc: { balance: netAmount + commission } },
        { session }
    );

    // Create transaction
    const transaction = await Transaction.create([{
        type: TransactionType.CASH_OUT,
        amount: payment.amount,
        fee: 0,
        commission: commission,
        netAmount: netAmount,
        fromWallet: userWallet._id,
        toWallet: agentWallet._id,
        initiatedBy: payment.userId,
        processedBy: payment.toUserId,
        status: TransactionStatus.COMPLETED,
        description: `Cash-out by agent`,
        reference: payment.transactionId
    }], { session });

    return transaction[0];
};

const failPayment = async (query: Record<string, string>) => {
    const { tran_id } = query;

    const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { status: PAYMENT_STATUS.FAILED },
        { new: true }
    );

    if (!updatedPayment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    return { success: false, message: "Payment Failed" };
};

const cancelPayment = async (query: Record<string, string>) => {
    const { tran_id } = query;

    const updatedPayment = await Payment.findOneAndUpdate(
        { transactionId: tran_id },
        { status: PAYMENT_STATUS.CANCELLED },
        { new: true }
    );

    if (!updatedPayment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    return { success: false, message: "Payment Cancelled" };
};
// src/modules/payment/payment.service.ts
// Add this new function to the PaymentService
const retryPayment = async (paymentId: string) => {
    // Find the existing payment
    const existingPayment = await Payment.findById(paymentId);
    console.log("Existing payment for retry:", existingPayment);
    if (!existingPayment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }

    // Check if payment is in a retry-able state
    if (existingPayment.status !== PAYMENT_STATUS.FAILED &&
        existingPayment.status !== PAYMENT_STATUS.CANCELLED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment cannot be retried");
    }

    const user = await User.findById(existingPayment.userId);
    console.log("User for retry payment:", user);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Generate a new transaction ID for the retry
    const newTransactionId = `TXN-${Date.now()}-${uuidv4().substr(0, 8)}`;

    // Update the existing payment with new transaction ID and reset status
    const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        {
            transactionId: newTransactionId,
            status: PAYMENT_STATUS.PENDING,
            $unset: { transactionID: 1 } // Remove any previous transaction reference
        },
        { new: true }
    );

    const userAddress = user.address || "N/A";
    const userEmail = user.email;
    const userPhoneNumber = user.phone || "01711111111";
    const userName = user.name;

    const sslPayload = {
        amount: existingPayment.amount,
        transactionId: newTransactionId,
        name: userName,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        address: userAddress,
        type: existingPayment.type
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload, paymentId);

    // Update payment with new gateway data
    await Payment.findByIdAndUpdate(paymentId, {
        paymentGatewayData: sslPayment,
        invoiceUrl: sslPayment.GatewayPageURL
    });

    return {
        paymentId: paymentId,
        paymentUrl: sslPayment.GatewayPageURL,
        transactionId: newTransactionId,
        amount: existingPayment.amount,
        type: existingPayment.type
    };
};



export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    retryPayment
};