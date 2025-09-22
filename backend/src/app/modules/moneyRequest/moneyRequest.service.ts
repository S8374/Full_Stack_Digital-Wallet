// src/modules/moneyRequest/moneyRequest.service.ts
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { MoneyRequest } from './moneyRequest.model';
import { ICreateMoneyRequest, RequestStatus } from './moneyRequest.interface';
import AppError from '../../errorHelpers/appError';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';
import { UserServices } from '../user/user.service';
import { Transaction } from '../transaction/transaction.model';
import { TransactionStatus, TransactionType } from '../transaction/transaction.interface';
import { v4 as uuidv4 } from 'uuid';

const createMoneyRequest = async (payload: ICreateMoneyRequest) => {
  const { fromUser, toUser, amount, description } = payload;

  // Check if users exist
  const [fromUserExists, toUserExists] = await Promise.all([
    User.findById(fromUser),
    User.findById(toUser)
  ]);

  if (!fromUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Requesting user not found");
  }

  if (!toUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient user not found");
  }

  if (fromUser.toString() === toUser.toString()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot request money from yourself");
  }

  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  // Check if there's already a pending request between these users
  const existingRequest = await MoneyRequest.findOne({
    fromUser,
    toUser,
    status: RequestStatus.PENDING
  });

  if (existingRequest) {
    throw new AppError(httpStatus.CONFLICT, "You already have a pending request with this user");
  }

  // Create the money request
  const moneyRequest = await MoneyRequest.create({
    fromUser,
    toUser,
    amount,
    description,
    status: RequestStatus.PENDING
  });

  return moneyRequest;
};

const getMoneyRequests = async (userId: Types.ObjectId, type: 'sent' | 'received') => {
  const query = type === 'sent' 
    ? { fromUser: userId } 
    : { toUser: userId };

  const requests = await MoneyRequest.find(query)
    .populate(type === 'sent' ? 'toUser' : 'fromUser', 'name email phone')
    .populate('transactionId')
    .sort({ createdAt: -1 });

  return requests;
};

const getMoneyRequestById = async (requestId: string, userId: Types.ObjectId) => {
  const request = await MoneyRequest.findOne({
    _id: requestId,
    $or: [{ fromUser: userId }, { toUser: userId }]
  })
    .populate('fromUser', 'name email phone')
    .populate('toUser', 'name email phone')
    .populate('transactionId');

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Money request not found");
  }

  return request;
};

const approveMoneyRequest = async (requestId: string, userId: Types.ObjectId) => {
  const session = await MoneyRequest.startSession();
  session.startTransaction();

  try {
    const request = await MoneyRequest.findOne({
      _id: requestId,
      toUser: userId,
      status: RequestStatus.PENDING
    }).session(session);

    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Pending money request not found");
    }

    // Send money using existing sendMoney service
    const transaction = await UserServices.sendMoney(
      userId.toString(),
      request.fromUser.toString(),
      request.amount,
      request.description || `Approved money request #${requestId}`
    );

    // Update the request status and link the transaction
    request.status = RequestStatus.APPROVED;
    request.transactionId = transaction.transaction._id;
    await request.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { request, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const rejectMoneyRequest = async (requestId: string, userId: Types.ObjectId) => {
  const request = await MoneyRequest.findOne({
    _id: requestId,
    toUser: userId,
    status: RequestStatus.PENDING
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Pending money request not found");
  }

  request.status = RequestStatus.REJECTED;
  await request.save();

  return request;
};

const cancelMoneyRequest = async (requestId: string, userId: Types.ObjectId) => {
  const request = await MoneyRequest.findOne({
    _id: requestId,
    fromUser: userId,
    status: RequestStatus.PENDING
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Pending money request not found");
  }

  request.status = RequestStatus.CANCELLED;
  await request.save();

  return request;
};

export const MoneyRequestServices = {
  createMoneyRequest,
  getMoneyRequests,
  getMoneyRequestById,
  approveMoneyRequest,
  rejectMoneyRequest,
  cancelMoneyRequest
};