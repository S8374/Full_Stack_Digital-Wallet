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
const requestToBecomeAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  
  const result = await AgentService.requestToBecomeAgent(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent request submitted successfully. Waiting for admin approval.",
    data: result
  });
});

// Cancel agent request
const cancelAgentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.user as any)?.userId;
  
  const result = await AgentService.cancelAgentRequest(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Agent request cancelled successfully",
    data: result
  });
});

export const AgentControllers = {
    cashIn,
    cashOut,
    cancelAgentRequest,
    requestToBecomeAgent
};