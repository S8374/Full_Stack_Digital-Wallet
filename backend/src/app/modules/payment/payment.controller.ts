// src/modules/payment/payment.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { envVariables } from "../../config/envVeriables";
import { PAYMENT_STATUS } from "./paymnet.interface";
import { Payment } from "./payment.model";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus } from "../transaction/transaction.interface";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { toUserId, amount, type } = req.body;

    const result = await PaymentService.initPayment(userId, toUserId, amount, type);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment initialized successfully",
        data: result,
    });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    console.log("Success payment callback received:", query);

    const result = await PaymentService.successPayment(query as Record<string, string>);

    if (result.success) {
        res.redirect(`${envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.tran_id}&message=${encodeURIComponent(result.message)}&amount=${query.amount}&status=success`);
    } else {
        res.redirect(`${envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?error=${encodeURIComponent(result.message)}&transactionId=${query.tran_id}`);
    }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    console.log("Fail payment callback received:", query);

    const result = await PaymentService.failPayment(query as Record<string, string>);

    res.redirect(`${envVariables.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.tran_id}&message=${encodeURIComponent(result.message)}&amount=${query.amount}&status=failed`);
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    console.log("Cancel payment callback received:", query);

    const result = await PaymentService.cancelPayment(query as Record<string, string>);

    res.redirect(`${envVariables.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.tran_id}&message=${encodeURIComponent(result.message)}&amount=${query.amount}&status=cancelled`);
});
// src/modules/payment/payment.controller.ts
// Add this new function
const retryPayment = catchAsync(async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;

    const result = await PaymentService.retryPayment(paymentId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment retry initialized successfully",
        data: result,
    });
});

const getCancelPaymentSpasicUser = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any)?.userId;
    console.log(userId)
    const cancelledPayments = await Payment.find({
        userId: userId,
        status: PAYMENT_STATUS.FAILED,
    }).sort({ createdAt: -1 });
    console.log('cancelledPayments', cancelledPayments)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cancelled payments fetched successfully",
        data: cancelledPayments,
    });
});
const getCompletPaymentSpasificUser = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any)?.userId;
    console.log(userId)
    const cancelledPayments = await Payment.find({
        userId: userId,
        status: PAYMENT_STATUS.PAID,
    }).sort({ createdAt: -1 });
    console.log('cancelledPayments', cancelledPayments)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Cancelled payments fetched successfully",
        data: cancelledPayments,
    });
});
const getTransactionSpecificUser = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as any)?.userId;
    console.log('TransactionHistory', userId);
    const TransactionHistory = await Transaction.find({

        initiatedBy: userId,
        status: TransactionStatus.COMPLETED,
    }).sort({ createdAt: -1 });
    console.log('cancelledPayments', TransactionHistory)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Transaction  fetched successfully",
        data: TransactionHistory,
    });
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
    retryPayment,
    getCancelPaymentSpasicUser,
    getTransactionSpecificUser,
    getCompletPaymentSpasificUser
};