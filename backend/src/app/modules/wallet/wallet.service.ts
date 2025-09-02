import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errorHelpers/appError';
import { Wallet } from './wallet.model';
import { Transaction } from '../transaction/transaction.model';
import { User } from '../user/user.model';
import { WalletStatus } from './wallet.interface';
import { TransactionStatus, TransactionType } from '../transaction/transaction.interface';
import { v4 as uuidv4 } from "uuid";




const addMoney = async (userId: string, amount: number, description?: string) => {

  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  // ✅ Reset limits outside the transaction
  const walletBefore = await Wallet.findOne({ userId });
  if (!walletBefore) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  if (walletBefore.status !== WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, `Wallet is ${walletBefore.status}`);
  }
  await Wallet.checkAndResetLimits(walletBefore._id);

  // ✅ Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Only one update inside transaction
    const wallet = await Wallet.findOneAndUpdate(
      { userId, status: WalletStatus.ACTIVE },
      { $inc: { balance: amount } },
      { new: true, session }
    );

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found or inactive");
    }

    const transaction = await Transaction.create([{
      type: TransactionType.DEPOSIT,
      amount,
      fee: 0,
      commission: 0,
      netAmount: amount,
      fromWallet: wallet._id,
      toWallet: wallet._id,
      initiatedBy: userId as any,
      status: TransactionStatus.COMPLETED,
      description: description || "Money added to wallet",
      reference: `DEP-${uuidv4()}`
    }], { session });
    await session.commitTransaction();
    session.endSession();

    return {
      wallet,
      transaction: transaction[0]
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const withdrawMoney = async (userId: string, amount: number, description?: string) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new AppError(httpStatus.FORBIDDEN, `Wallet is ${wallet.status}`);
    }

    // Check and reset limits
    await Wallet.checkAndResetLimits(wallet._id);

    // Check sufficient balance
    if (wallet.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    // Check daily limit
    if (wallet.dailySpent + amount > wallet.dailyLimit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Daily withdrawal limit exceeded");
    }

    // Check monthly limit
    if (wallet.monthlySpent + amount > wallet.monthlyLimit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Monthly withdrawal limit exceeded");
    }

    // Update balance and spent amounts
    wallet.balance -= amount;
    wallet.dailySpent += amount;
    wallet.monthlySpent += amount;
    await wallet.save({ session });

    // Create transaction record
    const transaction = await Transaction.create([{
      type: TransactionType.WITHDRAWAL,
      amount,
      fee: 0,
      commission: 0,
      netAmount: amount,
      fromWallet: wallet._id,
      initiatedBy: userId as any,
      status: TransactionStatus.COMPLETED,
      description: description || "Money withdrawn from wallet",
      reference: `WDL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return {
      wallet,
      transaction: transaction[0]
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const WalletServices = {
  addMoney,
  withdrawMoney
};