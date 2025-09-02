import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { addMoneyValidation, withdrawMoneyValidation } from "./wallet.validation";
import { WalletControllers } from "./wallet.controller";

const router = Router()
router.post("/add-money", checkAuth(Role.USER), validateRequest(addMoneyValidation), WalletControllers.addMoney);
router.post("/withdraw", checkAuth(Role.USER), validateRequest(withdrawMoneyValidation), WalletControllers.withdrawMoney);
export const WalletRoutes = router;