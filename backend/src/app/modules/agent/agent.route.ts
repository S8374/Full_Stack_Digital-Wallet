import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { cashInValidation, cashOutValidation } from "../wallet/wallet.validation";
import { AgentControllers } from "./agent.controller";
import { Role } from "../user/user.interface";

const router = Router();
// Agent routes
router.post("/cash-in", checkAuth(Role.AGENT), validateRequest(cashInValidation), AgentControllers.cashIn);
router.post("/cash-out", checkAuth(Role.AGENT), validateRequest(cashOutValidation), AgentControllers.cashOut);

export const AgentRoutes =  router ;