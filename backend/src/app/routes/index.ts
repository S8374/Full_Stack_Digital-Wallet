import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../auth/auth.route"
import { WalletRoutes } from "../modules/wallet/wallet.route"
import { AgentRoutes } from "../modules/agent/agent.route"
import { AdminRoutes } from "../modules/admin/admin.route"
import { PaymentRoutes } from "../modules/payment/payment.routes"
import { OtpRoutes } from "../modules/otp/otp.route"
export const router = Router()

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/wallet",
        route: WalletRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/agent",
        route: AgentRoutes
    },
    {
        path: "/payment", // Add Payment routes
        route: PaymentRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

