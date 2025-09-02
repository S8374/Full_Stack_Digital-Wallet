import mongoose, { Types } from "mongoose";
import AppError from "../../errorHelpers/appError";
import httpStatus from 'http-status';
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { TransactionStatus, TransactionType } from "../transaction/transaction.interface";

export const cashIn = async (
  agentId: string,
  userId: string,
  amount: number,
  description?: string
) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  // Get agent wallet
  const agentWallet = await Wallet.findOne({ userId: agentId, type: "agent" });
  if (!agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
  }
//   if (agentWallet.status !== WalletStatus.ACTIVE) {
//     throw new AppError(httpStatus.FORBIDDEN, `Agent wallet is ${agentWallet.status}`);
//   }

  // Get user wallet
  const userWallet = await Wallet.findOne({ userId, type: "user" });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }
  if (userWallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, `User wallet is ${userWallet.status}`);
  }

  // Reset limits (outside transaction, avoids conflict)
  await Wallet.checkAndResetLimits(agentWallet._id);

  // Check sufficient balance for agent
  if (agentWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent has insufficient balance");
  }

  // Calculate commission (1.5% of amount)
  const commission = amount * 0.015;
  const netAmount = amount - commission;

  // Update agent wallet atomically
  const updatedAgentWallet = await Wallet.findOneAndUpdate(
    { _id: agentWallet._id, balance: { $gte: amount } },
    {
      $inc: {
        balance: -amount + commission, // deduct amount, add back commission
        dailySpent: amount,
        monthlySpent: amount,
      },
    },
    { new: true }
  );

  if (!updatedAgentWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Agent wallet update failed (insufficient balance)");
  }

  // Update user wallet atomically
  const updatedUserWallet = await Wallet.findByIdAndUpdate(
    userWallet._id,
    { $inc: { balance: netAmount } },
    { new: true }
  );

  if (!updatedUserWallet) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "User wallet update failed");
  }

  // Create transaction record
  const transaction = await Transaction.create({
    type: TransactionType.CASH_IN,
    amount,
    fee: 0,
    commission,
    netAmount,
    fromWallet: agentWallet._id,
    toWallet: userWallet._id,
    initiatedBy: new Types.ObjectId(agentId),
    processedBy: new Types.ObjectId(agentId),
    status: TransactionStatus.COMPLETED,
    description: description || `Cash-in by agent`,
    reference: `CIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });

  return {
    agentWallet: updatedAgentWallet,
    userWallet: updatedUserWallet,
    transaction,
  };
};
export const cashOut = async (
  agentId: string,
  userId: string,
  amount: number,
  description?: string
) => {
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  // Get agent wallet
  const agentWallet = await Wallet.findOne({ userId: agentId, type: "agent" });
  if (!agentWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent wallet not found");
  }
//   if (agentWallet.status !== WalletStatus.ACTIVE) {
//     throw new AppError(httpStatus.FORBIDDEN, `Agent wallet is ${agentWallet.status}`);
//   }

  // Get user wallet
  const userWallet = await Wallet.findOne({ userId, type: "user" });
  if (!userWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "User wallet not found");
  }
  if (userWallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, `User wallet is ${userWallet.status}`);
  }

  // Reset limits (outside transaction, avoids conflict)
  await Wallet.checkAndResetLimits(userWallet._id);

  // Check balance
  if (userWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has insufficient balance");
  }

  // Check daily/monthly limits
  if (userWallet.dailySpent + amount > userWallet.dailyLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Daily withdrawal limit exceeded");
  }
  if (userWallet.monthlySpent + amount > userWallet.monthlyLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Monthly withdrawal limit exceeded");
  }

  // Commission (1.5%)
  const commission = amount * 0.015;
  const netAmount = amount - commission;

  // Update user wallet atomically (deduct money + track spent)
  const updatedUserWallet = await Wallet.findOneAndUpdate(
    { _id: userWallet._id, balance: { $gte: amount } },
    {
      $inc: {
        balance: -amount,
        dailySpent: amount,
        monthlySpent: amount,
      },
    },
    { new: true }
  );

  if (!updatedUserWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "User wallet update failed (insufficient balance)");
  }

  // Update agent wallet atomically (add money + commission)
  const updatedAgentWallet = await Wallet.findByIdAndUpdate(
    agentWallet._id,
    {
      $inc: {
        balance: netAmount + commission,
      },
    },
    { new: true }
  );

  if (!updatedAgentWallet) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Agent wallet update failed");
  }

  // Create transaction record
  const transaction = await Transaction.create({
    type: TransactionType.CASH_OUT,
    amount,
    fee: 0,
    commission,
    netAmount,
    fromWallet: userWallet._id,
    toWallet: agentWallet._id,
    initiatedBy: new Types.ObjectId(userId),
    processedBy: new Types.ObjectId(agentId),
    status: TransactionStatus.COMPLETED,
    description: description || `Cash-out by agent`,
    reference: `COUT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });

  return {
    agentWallet: updatedAgentWallet,
    userWallet: updatedUserWallet,
    transaction,
  };
};
export const AgentService ={
    cashIn,
    cashOut
}