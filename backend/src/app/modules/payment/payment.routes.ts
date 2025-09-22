// src/modules/payment/payment.route.ts
import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/init-payment/:userId", checkAuth(Role.USER, Role.AGENT), PaymentController.initPayment);
router.post("/success", PaymentController.successPayment); // Changed from POST to GET
router.post("/fail", PaymentController.failPayment); // Changed from POST to GET
router.post("/cancel", PaymentController.cancelPayment); // Changed from POST to GET
router.post("/retry-payment/:paymentId", checkAuth(Role.USER, Role.AGENT), PaymentController.retryPayment);
router.get(
    "/my-cancelled-payments",
    checkAuth(Role.USER, Role.AGENT),
    PaymentController.getCancelPaymentSpasicUser
);
router.get(
    "/my-transaction",
    checkAuth(Role.USER, Role.AGENT),
    PaymentController.getTransactionSpecificUser
);
router.get(
    "/my-complete-payments",
    checkAuth(Role.USER, Role.AGENT),
    PaymentController.getCompletPaymentSpasificUser
);
export const PaymentRoutes = router;