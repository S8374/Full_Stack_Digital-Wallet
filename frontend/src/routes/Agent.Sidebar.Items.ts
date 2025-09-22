import UserDashboard from "@/pages/User/UserDashboard";
import Wallet from "@/pages/User/wallet/Wallet";
import type { ISidebarItem } from "@/types/index.types";
import CashIn from "@/pages/User/AddMoney/Add.Money";
import SendMoney from "@/pages/User/sendMoney/Send.money";
import SendMoneyRequest from "@/pages/User/wallet/SendMoneyRequest";
import CashInUserWallet from "@/pages/Agent/CashIn/CashIn";

export const agentSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/agent/dashboard",
                component: UserDashboard,
            },
  {
                title: "My-Wallet",
                url: "/agent/myWallet",
                component: Wallet
            }
            ,
            {
                title: "AddMoney",
                url: "/agent/addMoney",
                component: CashIn
            }
            
            
            ,
            {
                title: "Send-Money",
                url: "/agent/sendMoney",
                component: SendMoney
            },

            {
                title: "Req-Money",
                url: "/agent/reqMoney",
                component: SendMoneyRequest
            }
    ,

            {
                title: "CashIn-Money User Wallet",
                url: "/agent/cashIn",
                component: CashInUserWallet
            }
         
        ],
    },

];