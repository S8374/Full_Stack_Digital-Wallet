import mongoose from "mongoose";
import AppError from "../../errorHelpers/appError";
import httpStatus from 'http-status';
import { Wallet } from "../wallet/wallet.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { User } from "../user/user.model";
import { UserStatus, Role } from "../user/user.interface";
import { Transaction } from "../transaction/transaction.model";

// Get all users
const getAllUsers = async (filters: any = {}, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const query: any = { role: Role.USER || Role.AGENT };

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.fromDate || filters.toDate) {
    query.createdAt = {};
    if (filters.fromDate) query.createdAt.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.createdAt.$lte = new Date(filters.toDate);
  }

  const users = await User.find(query)
    .select('-password')
    .populate({
      path: 'wallet',
      select: 'balance currency status type'
    })
    .populate({
      path: 'transactions',
      select: 'type amount fee commission status createdAt reference description',
      options: {
        sort: { createdAt: -1 },
        limit: 10 // Limit transactions per user for performance
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Get all agents
const getAllAgents = async () => {
  const agents = await User.find({ role: Role.AGENT })
    .select('-password')
    .populate('wallet')
    .sort({ createdAt: -1 });

  return agents;
};

// Get all wallets
const getAllWallets = async () => {
  const wallets = await Wallet.find()
    .populate('userId', 'name email role status')
    .sort({ createdAt: -1 });

  return wallets;
};

// Get all transactions with pagination
const getAllTransactions = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const transactions = await Transaction.find()
    .populate('fromWallet', 'userId balance currency')
    .populate('toWallet', 'userId balance currency')
    .populate('initiatedBy', 'name email')
    .populate('processedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments();

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Update wallet status
const updateWalletStatus = async (walletId: string, status: WalletStatus, adminId: string) => {
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const user = await User.findById(wallet.userId);
  if (!user || user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  wallet.status = status;
  await wallet.save();

  return wallet;
};

// Update agent status
const updateAgentStatus = async (agentId: string, status: UserStatus, adminId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const agent = await User.findById(agentId).session(session);

    if (!agent) {
      throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }

    if (agent.role !== Role.AGENT) {
      throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
    }

    // Update agent status
    agent.status = status;
    await agent.save({ session });

    // If suspending, also block the wallet
    if (status === UserStatus.BLOCKED) {
      const agentWallet = await Wallet.findOne({ userId: agentId }).session(session);
      if (agentWallet) {
        agentWallet.status = WalletStatus.BLOCKED;
        await agentWallet.save({ session });
      }
    }

    // If approving, activate the wallet
    if (status === UserStatus.ACTIVE) {
      const agentWallet = await Wallet.findOne({ userId: agentId }).session(session);
      if (agentWallet) {
        agentWallet.status = WalletStatus.ACTIVE;
        await agentWallet.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return {
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        status: agent.status,
        role: agent.role
      }
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get pending agents
const getPendingAgents = async () => {
  const pendingAgents = await User.find({
    role: Role.AGENT,
    status: UserStatus.PENDING
  })
    .select('name email phone createdAt status')
    .populate('wallet');

  return pendingAgents;
};

// Get user by ID
const getUserById = async (userId: string) => {
  const user = await User.findById(userId)
    .select('-password')
    .populate('wallet');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// Get agent by ID
const getAgentById = async (agentId: string) => {
  const agent = await User.findById(agentId)
    .select('-password')
    .populate('wallet');

  if (!agent || agent.role !== Role.AGENT) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  return agent;
};
// Block/Unblock user
const updateUserStatus = async (userId: string, status: UserStatus, adminId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Cannot modify admin status");
    }

    // Update user status
    user.status = status;
    await user.save({ session });

    // If blocking, also block the wallet
    if (status === UserStatus.BLOCKED) {
      const userWallet = await Wallet.findOne({ userId }).session(session);
      if (userWallet) {
        userWallet.status = WalletStatus.BLOCKED;
        await userWallet.save({ session });
      }
    }

    // If activating, activate the wallet
    if (status === UserStatus.ACTIVE) {
      const userWallet = await Wallet.findOne({ userId }).session(session);
      if (userWallet) {
        userWallet.status = WalletStatus.ACTIVE;
        await userWallet.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role
      }
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get user statistics
const getUserStatistics = async () => {
  const totalUsers = await User.countDocuments({
    role: { $in: [Role.USER, Role.AGENT] },
    isDeleted: false
  });

  const activeUsers = await User.countDocuments({
    status: UserStatus.ACTIVE,
    role: { $in: [Role.USER, Role.AGENT] },
    isDeleted: false
  });

  const blockedUsers = await User.countDocuments({
    status: UserStatus.BLOCKED,
    role: { $in: [Role.USER, Role.AGENT] },
    isDeleted: false
  });

  const pendingAgents = await User.countDocuments({
    status: UserStatus.PENDING,
    role: Role.AGENT,
    isDeleted: false
  });

  const totalAgents = await User.countDocuments({
    role: Role.AGENT,
    isDeleted: false
  });

  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    pendingAgents,
    totalAgents,
    inactiveUsers: totalUsers - activeUsers - blockedUsers
  };
};

// Get system statistics
const getSystemStatistics = async () => {
  const totalTransactions = await Transaction.countDocuments();
  const totalWallets = await Wallet.countDocuments();

  const totalBalance = await Wallet.aggregate([
    { $match: { status: WalletStatus.ACTIVE } },
    { $group: { _id: null, total: { $sum: "$balance" } } }
  ]);

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const todayTransactions = await Transaction.countDocuments({
    createdAt: { $gte: startOfDay }
  });

  return {
    totalTransactions,
    totalWallets,
    totalBalance: totalBalance[0]?.total || 0,
    todayTransactions
  };
};
export const AdminService = {
  getAllUsers,
  getAllAgents,
  getAllWallets,
  getAllTransactions,
  updateWalletStatus,
  updateAgentStatus,
  getPendingAgents,
  getUserById,
  getAgentById,
  updateUserStatus,
  getUserStatistics,
  getSystemStatistics
};