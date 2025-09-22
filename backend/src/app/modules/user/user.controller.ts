import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { createUserTokens } from '../../utils/token/userTokens';
import { setAuthCookie } from '../../utils/token/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errorHelpers/appError';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1️⃣ Create the user
  const user = await UserServices.createUser(req.body);

  // 2️⃣ Generate tokens
  const userTokens = createUserTokens(user);

  // 3️⃣ Set tokens in cookies
  setAuthCookie(res, userTokens);

  // 4️⃣ Return response (hide password)
  const { password, ...rest } = user.toObject();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      accessToken: userTokens.accessToken,
      refreshToken: userTokens.refreshToken,
      user: rest,
    },
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fromUserId = (req.user as any)?.userId;
  const { toUserId, amount, description } = req.body;
  console.log("all data", toUserId, amount, description, fromUserId);
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
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload
  const result = await UserServices.getMe(decodedToken.userId);

  // res.status(httpStatus.OK).json({
  //     success: true,
  //     message: "All Users Retrieved Successfully",
  //     data: users
  // })
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your profile Retrieved Successfully",
    data: result.data
  })
})

const searchUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { q } = req.query;
  const currentUserId = (req.user as any)?.userId;

  if (!q || typeof q !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, "Search query is required");
  }

  const users = await UserServices.searchUsers(q, currentUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users found successfully",
    data: users
  });
});

// Update user profile
// Update user profile
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  const updateData = req.body;

  const result = await UserServices.updateProfile(userId, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result
  });
});
export const UserControllers = {
  createUser,
  sendMoney,
  getMyWallet,
  getMe,
  searchUsers,
  updateProfile
};