// src/modules/moneyRequest/moneyRequest.routes.ts
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { MoneyRequestControllers } from "./moneyRequest.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { createMoneyRequestValidation, requestActionValidation } from "./moneyRequest.validation";

const router = Router();

router.post(
  "/request",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(createMoneyRequestValidation),
  MoneyRequestControllers.createMoneyRequest
);

router.get(
  "/requests",
  checkAuth(Role.USER, Role.AGENT),
  MoneyRequestControllers.getMyRequests
);

router.get(
  "/requests/:requestId",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(requestActionValidation),
  MoneyRequestControllers.getRequestById
);

router.post(
  "/requests/:requestId/approve",
  checkAuth(Role.USER, Role.AGENT),

  MoneyRequestControllers.approveRequest
);

router.post(
  "/requests/:requestId/reject",
  checkAuth(Role.USER, Role.AGENT),

  MoneyRequestControllers.rejectRequest
);

router.post(
  "/requests/:requestId/cancel",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(requestActionValidation),
  MoneyRequestControllers.cancelRequest
);

export const MoneyRequestRoutes = router;