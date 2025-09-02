import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { AdminService } from "./admin.service";

// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await AdminService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: users
    });
});

// Get all agents
const getAllAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const agents = await AdminService.getAllAgents();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agents retrieved successfully",
        data: agents
    });
});

// Get all wallets
const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await AdminService.getAllWallets();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallets retrieved successfully",
        data: wallets
    });
});

// Get all transactions
const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await AdminService.getAllTransactions(
        parseInt(page as string),
        parseInt(limit as string)
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Transactions retrieved successfully",
        data: transactions
    });
});

// Block/unblock wallet
const updateWalletStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const { status } = req.body;
    const adminId = (req.user as any)?.userId;

    const wallet = await AdminService.updateWalletStatus(walletId, status, adminId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Wallet ${status} successfully`,
        data: wallet
    });
});

// Approve/suspend agent
const updateAgentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { agentId } = req.params;
    const { status } = req.body;
    const adminId = (req.user as any)?.userId;

    const result = await AdminService.updateAgentStatus(agentId, status, adminId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `Agent ${status} successfully`,
        data: result
    });
});

// Get pending agents
const getPendingAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const agents = await AdminService.getPendingAgents();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Pending agents retrieved successfully",
        data: agents
    });
});

// Get user by ID
const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await AdminService.getUserById(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully",
        data: user
    });
});

// Get agent by ID
const getAgentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { agentId } = req.params;
    const agent = await AdminService.getAgentById(agentId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Agent retrieved successfully",
        data: agent
    });
});
// Block/unblock user
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { status } = req.body;
    const adminId = (req.user as any)?.userId;

    const result = await AdminService.updateUserStatus(userId, status, adminId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `User ${status} successfully`,
        data: result
    });
});

// Get user statistics
const getUserStatistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const statistics = await AdminService.getUserStatistics();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User statistics retrieved successfully",
        data: statistics
    });
});

// Get system statistics
const getSystemStatistics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const statistics = await AdminService.getSystemStatistics();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "System statistics retrieved successfully",
        data: statistics
    });
});

export const AdminControllers = {
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