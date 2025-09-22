import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { addMoneyValidation, withdrawMoneyValidation } from "./wallet.validation";
import { WalletControllers } from "./wallet.controller";

const router = Router()
router.post("/add-money", checkAuth(Role.USER,Role.AGENT), validateRequest(addMoneyValidation), WalletControllers.addMoney);
router.post("/withdraw", checkAuth(Role.USER), validateRequest(withdrawMoneyValidation), WalletControllers.withdrawMoney);
router.get("/users/:userId/wallet", checkAuth(Role.ADMIN), WalletControllers.getSingleUserWallet);

export const WalletRoutes = router;