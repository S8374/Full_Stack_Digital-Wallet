import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { AgentService } from "./agent.service";

const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const agentId = (req.user as any)?.userId;
    const { userId, amount, description } = req.body;
    console.log("Agent ID:", agentId);
    console.log("Request Body:", req.body);
    const result = await AgentService.cashIn(agentId as string, userId, amount, description);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Cash-in completed successfully",
        data: result
    });
});

const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const agentId = (req.user as any)?.userId;
    const { userId, amount, description } = req.body;

    const result = await AgentService.cashOut(agentId as string, userId, amount, description);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Cash-out completed successfully",
        data: result
    });
});
export const AgentControllers = {
    cashIn,
    cashOut
};