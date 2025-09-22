import httpStatus from 'http-status';
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";
import { User } from "./user.model";
import AppError from '../../errorHelpers/appError';
import bcrypt from 'bcrypt';
import { Wallet } from '../wallet/wallet.model';
import { WalletStatus, WalletType } from '../wallet/wallet.interface';
import { Transaction } from '../transaction/transaction.model';
import { TransactionStatus, TransactionType } from '../transaction/transaction.interface';
import mongoose, { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, phone, role = Role.USER, ...rest } = payload;

  console.log("Received payload:", payload);

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists with this email");
  }

  const hasPassword = await bcrypt.hash(password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "Credential",
    providerId: email as string,
  };

  // FIXED: Separate role and status correctly
  const userRole = role; // This should be the role from payload (or default USER)
  const userStatus = role === Role.AGENT ? UserStatus.PENDING : UserStatus.ACTIVE; // This is the status

  // Determine wallet type based on role
  const walletType = role === Role.AGENT ? WalletType.AGENT : WalletType.USER;
  const walletStatus = role === Role.AGENT ? WalletStatus.INACTIVE : WalletStatus.ACTIVE;
  // Add agent request if user is registering as agent
  

  // Create user with correct role and status
  const user = await User.create({
    email,
    password: hasPassword,
    phone,
    auths: [authProvider],
    status: userStatus, // Set user status (pending for agents, active for users)
    role: userRole,     // Set user role (agent or user)
    ...rest,
  });

  // Create wallet for user
  await Wallet.create({
    userId: user._id,
    balance: 50,
    currency: "BDT",
    type: walletType,
    status: walletStatus,
    minBalance: 0,
    dailyLimit: walletType === WalletType.AGENT ? 100000 : 50000,
    monthlyLimit: walletType === WalletType.AGENT ? 300000 : 150000,
    dailySpent: 0,
    monthlySpent: 0,
    lastResetDate: new Date()
  });

  console.log("Created user:", user);
  return user;
};

export const sendMoney = async (
  fromUserId: string,
  toUserId: string,
  amount: number,
  description?: string
) => {
  const session = await Wallet.startSession();
  if (amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Amount must be greater than zero");
  }

  if (fromUserId === toUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot send money to yourself");
  }

  // Get sender wallet
  const fromWallet = await Wallet.findOne({ userId: fromUserId });
  if (!fromWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Sender wallet not found");
  }
  if (fromWallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, `Sender wallet is ${fromWallet.status}`);
  }

  // Get recipient wallet
  const toWallet = await Wallet.findOne({ userId: toUserId });
  if (!toWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Recipient wallet not found");
  }
  if (toWallet.status !== WalletStatus.ACTIVE) {
    throw new AppError(httpStatus.FORBIDDEN, `Recipient wallet is ${toWallet.status}`);
  }

  // Reset limits (outside transaction, avoids conflict)
  await Wallet.checkAndResetLimits(fromWallet._id);

  // Check sufficient balance
  if (fromWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  // Check daily & monthly limits
  if (fromWallet.dailySpent + amount > fromWallet.dailyLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Daily transfer limit exceeded");
  }
  if (fromWallet.monthlySpent + amount > fromWallet.monthlyLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Monthly transfer limit exceeded");
  }

  // Calculate fee (1% of amount, min 5 BDT, max 50 BDT)
  const fee = Math.min(Math.max(amount * 0.01, 5), 50);
  const netAmount = amount - fee;

  // Update sender wallet atomically
  const updatedFromWallet = await Wallet.findOneAndUpdate(
    { _id: fromWallet._id, balance: { $gte: amount } }, // ensure balance is still valid
    {
      $inc: {
        balance: -amount,
        dailySpent: amount,
        monthlySpent: amount,
      },
    },
    { new: true }
  );

  if (!updatedFromWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance or wallet update failed");
  }

  // Update recipient wallet atomically
  const updatedToWallet = await Wallet.findByIdAndUpdate(
    toWallet._id,
    { $inc: { balance: netAmount } },
    { new: true, runValidators: true, session }
  );

  if (!updatedToWallet) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Recipient wallet update failed");
  }

  // Create transaction record
  const transaction = await Transaction.create({
    type: TransactionType.TRANSFER,
    amount,
    fee,
    commission: 0,
    netAmount,
    fromWallet: fromWallet._id,
    toWallet: toWallet._id,
    initiatedBy: new Types.ObjectId(fromUserId),
    status: TransactionStatus.COMPLETED,
    description: description || `Money transfer to user`,
    reference: `TRF-${uuidv4()}`, // unique reference using UUID
  });

  return {
    fromWallet: updatedFromWallet,
    toWallet: updatedToWallet,
    transaction,
  };
};

const getWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // Use static method instead of instance method
  const updatedWallet = await Wallet.checkAndResetLimits(wallet._id);
  return updatedWallet;
};
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user
  }
};
const searchUsers = async (searchQuery: string, currentUserId: string) => {
  if (!searchQuery || searchQuery.length < 3) {
    throw new AppError(httpStatus.BAD_REQUEST, "Search query must be at least 3 characters long");
  }

  const users = await User.find({
    $and: [
      {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { phone: { $regex: searchQuery, $options: 'i' } }
        ]
      },
      { _id: { $ne: new Types.ObjectId(currentUserId) } }, // Exclude current user
      { isDeleted: false },
      { status: UserStatus.ACTIVE }
    ]
  })
    .select('name email phone role status')
    .limit(20)
    .lean();

  return users;
};
// Update user profile
const updateProfile = async (userId: string, updateData: any) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const UserServices = {
  createUser,
  sendMoney,
  getWallet,
  getMe,
  searchUsers,
  updateProfile
};
