// src/modules/wallet/wallet.controller.ts
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { PaymentService } from "../payment/payment.service";
import { PAYMENT_TYPE } from "../payment/paymnet.interface";
import { Wallet } from "./wallet.model";

const addMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { amount, description } = req.body;

  // For add money, toUserId is same as userId
  const result = await PaymentService.initPayment(
    userId as string,
    userId as string,
    amount,
    PAYMENT_TYPE.ADD_MONEY
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment initialized successfully. Redirect to payment URL.",
    data: result
  });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { amount, description } = req.body;

  // For withdrawal, toUserId is same as userId
  const result = await PaymentService.initPayment(
    userId as string,
    userId as string,
    amount,
    PAYMENT_TYPE.WITHDRAW
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdrawal payment initialized successfully. Redirect to payment URL.",
    data: result
  });
});
const getSingleUserWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized or userId missing",
    });
    return;
  }

  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    res.status(404).json({
      success: false,
      message: "Wallet not found",
    });
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet fetched successfully",
    data: wallet,
  });
});


export const WalletControllers = {
  addMoney,
  withdrawMoney,
  getSingleUserWallet
};