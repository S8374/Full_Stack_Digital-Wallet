import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from '../../utils/catchAsync';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log("User request:", req.body);
    const user = await UserServices.createUser(req.body);
  
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
});
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //console.log("Send money called", req.user);
   // console.log("Request body:", req.body); 
    const fromUserId = (req.user as any)?.userId;
    const { toUserId, amount, description } = req.body;
     
    const result = await UserServices.sendMoney(fromUserId as string, toUserId, amount, description);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Money sent successfully",
        data: result
    });
});
const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   console.log("Get my wallet called", req.user);
  const userId = (req.user as any)?.userId;
   console.log("Get my wallet called", userId);
  const wallet = await UserServices.getWallet(userId);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Wallet retrieved successfully",
    data: wallet
  });
});
export const UserControllers = {
    createUser,
    sendMoney,
    getMyWallet
};