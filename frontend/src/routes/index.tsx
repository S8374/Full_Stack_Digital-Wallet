import App from "@/App";
import Homepage from "@/components/Home/Home.page";
import Dashboard from "@/components/Layout/Dashboard";
import Register from "@/components/user/Register/Register";
import { role } from "@/constant/role";
import GoogleCallback from "@/pages/GoogleCallback";
import type { TRole } from "@/types/index.types";
import { generateRoutes } from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { userSidebarItems } from "./User.Sidebar.Items";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentFailure from "@/pages/payment/PaymentFailure";
import PaymentCancel from "@/pages/payment/PaymentCancel";
import { agentSidebarItems } from "./Agent.Sidebar.Items";
import { adminSidebarItems } from "./Admin.Sidebar,Items";
import ResetPassword from "@/pages/ResetPassword";
import UserProfile from "@/components/user/User.Profile";
import SignIn from "@/components/user/SignIn/SignIn";
import Unauthorized from "@/pages/Unauthorized";
import FeaturesPage from "@/pages/Features.page";
import PricingPage from "@/pages/Pricing.page";
import AboutPage from "@/pages/About.page";
import ContactPage from "@/pages/Contact.page";
import FAQ from "@/pages/FAQ";

export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true
            },

            {
                path: "/profile",
                Component: UserProfile
            }
            ,

            {
                path: "/features",
                Component: FeaturesPage
            }
            ,

            {
                path: "/pricing",
                Component: PricingPage
            }
            ,

            {
                path: "/about",
                Component: AboutPage
            }
            ,

            {
                path: "/contact",
                Component: ContactPage
            }
            ,
            {
                path: "/faq",
                Component: FAQ
            }
        ]
    },
    {
        Component: SignIn,
        path: "/login",
    },
    {
        Component: Register,
        path: "/register",
    },
    {
        path: "/auth/google/callback",
        Component: GoogleCallback,
    },
    {
        Component: withAuth(Dashboard, role.user as TRole),
        path: "/user",
        children: [
            {
                index: true,
                element: <Navigate to="/user/dashboard" replace />,
            },
            ...generateRoutes(userSidebarItems),
        ],
    },
    {
        Component: withAuth(Dashboard, role.agent as TRole),
        path: "/agent",
        children: [
            {
                index: true,
                element: <Navigate to="/agent/dashboard" replace />,
            },
            ...generateRoutes(agentSidebarItems),
        ],
    },
    {
        Component: withAuth(Dashboard, role.admin as TRole),
        path: "/admin",
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
            },
            ...generateRoutes(adminSidebarItems),
        ],
    },

    {
        path: "/payment/success",
        Component: PaymentSuccess,
    },
    {
        path: "/payment/fail",
        Component: PaymentFailure,
    },
    {
        path: "/payment/cancel",
        Component: PaymentCancel,
    },
    {
        path: "/reset-password",
        Component: ResetPassword,
    },
    {
        path: "/unauthorized",
        Component: Unauthorized,
    }
]);