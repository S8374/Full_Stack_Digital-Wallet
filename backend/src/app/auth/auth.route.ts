import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import passport from "passport";
import { envVariables } from "../config/envVeriables";
import { checkAuth } from "../middleware/checkAuth";
import { Role } from "../modules/user/user.interface";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.put("/set-role", checkAuth(...Object.values(Role)), AuthControllers.setRoleController);
router.post("/logout", AuthControllers.logout);

//password reset
router.post("/forgot-password", AuthControllers.forgotPassword);
router.post("/reset-password",  AuthControllers.resetPassword);
// set new password
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);

//set password if not set already google auth user
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

// refresh access token
router.post("/refresh-token", AuthControllers.getNewAccessToken);



router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
});
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVariables.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), AuthControllers.googleCallbackController)

export const AuthRoutes = router;