// src/modules/moneyRequest/moneyRequest.controller.ts
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from '../../utils/catchAsync';
import { MoneyRequestServices } from './moneyRequest.service';
import { Types } from 'mongoose';

const createMoneyRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fromUserId = (req.user as any)?.userId;
  const { toUserId, amount, description } = req.body;

  const moneyRequest = await MoneyRequestServices.createMoneyRequest({
    fromUser: new Types.ObjectId(fromUserId),
    toUser: new Types.ObjectId(toUserId),
    amount,
    description
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Money request sent successfully",
    data: moneyRequest
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { type } = req.query; // 'sent' or 'received'
   
  const requests = await MoneyRequestServices.getMoneyRequests(
    new Types.ObjectId(userId),
    type as 'sent' | 'received'
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money requests retrieved successfully",
    data: requests
  });
});

const getRequestById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { requestId } = req.params;

  const request = await MoneyRequestServices.getMoneyRequestById(
    requestId,
    new Types.ObjectId(userId)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money request retrieved successfully",
    data: request
  });
});

const approveRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { requestId } = req.params;
  console.log("userId & requestId",userId,requestId);
  const result = await MoneyRequestServices.approveMoneyRequest(
    requestId,
    new Types.ObjectId(userId)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money request approved and sent successfully",
    data: result
  });
});

const rejectRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { requestId } = req.params;

  const request = await MoneyRequestServices.rejectMoneyRequest(
    requestId,
    new Types.ObjectId(userId)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money request rejected successfully",
    data: request
  });
});

const cancelRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const { requestId } = req.params;

  const request = await MoneyRequestServices.cancelMoneyRequest(
    requestId,
    new Types.ObjectId(userId)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money request cancelled successfully",
    data: request
  });
});

export const MoneyRequestControllers = {
  createMoneyRequest,
  getMyRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  cancelRequest
};