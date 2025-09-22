// src/routes/Admin.Sidebar.Items.ts
import AdminDashboard from "@/pages/Admin/Admin.Dashboard";
import AgentManagement from "@/pages/Admin/pages/AgentManagement";
import TransactionManagement from "@/pages/Admin/pages/TransactionManagement";
import UserManagement from "@/pages/Admin/pages/UserManagement";
import WalletManagement from "@/pages/Admin/pages/WalletManagement";

import type { ISidebarItem } from "@/types/index.types";

export const adminSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/admin/dashboard",
                component: AdminDashboard,
            }

            ,
            {
                title: "All Users",
                url: "/admin/users",
                component: UserManagement,
            },
            {
                title: "Agents",
                url: "/admin/agents",
                component: AgentManagement,
            }

            ,
            {
                title: "Transactions",
                url: "/admin/transactions",
                component: TransactionManagement,
            },
            {
                title: "Wallets",
                url: "/admin/wallets",
                component: WalletManagement,
            }
            
        ],
    }
];