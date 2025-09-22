import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { AdminControllers } from "./admin.controller";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { updateWalletStatusValidation, updateAgentStatusValidation, updateUserStatusValidation } from "./admin.validation";

const router = Router();

// User management
router.get("/users", checkAuth(Role.ADMIN,Role.AGENT), AdminControllers.getAllUsers);
router.get("/users/:userId", checkAuth(Role.ADMIN), AdminControllers.getUserById);
router.patch("/users/:userId/status", checkAuth(Role.ADMIN),  AdminControllers.updateUserStatus);
// Agent management
router.get("/agents", checkAuth(Role.ADMIN), AdminControllers.getAllAgents);
router.get("/agents/pending", checkAuth(Role.ADMIN), AdminControllers.getPendingAgents);
router.get("/agents/:agentId", checkAuth(Role.ADMIN), AdminControllers.getAgentById);
router.patch("/agents/:agentId/status", checkAuth(Role.ADMIN), validateRequest(updateAgentStatusValidation), AdminControllers.updateAgentStatus);

// Wallet management
router.get("/wallets", checkAuth(Role.ADMIN), AdminControllers.getAllWallets);
router.patch("/wallets/:walletId/status", checkAuth(Role.ADMIN), validateRequest(updateWalletStatusValidation), AdminControllers.updateWalletStatus);

// Transaction management
router.get("/transactions", checkAuth(Role.ADMIN), AdminControllers.getAllTransactions);
// Statistics
router.get("/statistics/users", checkAuth(Role.ADMIN), AdminControllers.getUserStatistics);
router.get("/statistics/system", checkAuth(Role.ADMIN), AdminControllers.getSystemStatistics);

export const AdminRoutes = router;
