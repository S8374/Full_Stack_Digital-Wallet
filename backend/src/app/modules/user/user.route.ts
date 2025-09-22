import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { sendMoneyValidation } from "../wallet/wallet.validation";

const router = Router()
router.get("/getWallet", checkAuth(Role.USER, Role.AGENT, Role.ADMIN), UserControllers.getMyWallet);
router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);
router.post("/send-money", checkAuth(Role.USER), validateRequest(sendMoneyValidation), UserControllers.sendMoney);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
    "/search",
    checkAuth(Role.USER, Role.AGENT, Role.ADMIN),
    UserControllers.searchUsers
);
router.patch("/profile", checkAuth(...Object.values(Role)), UserControllers.updateProfile);

export const UserRoutes = router