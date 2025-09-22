// src/routes/User.Sidebar.Items.ts
import type { ISidebarItem } from "@/types/index.types";
import UserDashboard from "@/pages/User/UserDashboard";
import Wallet from "@/pages/User/wallet/Wallet";
import CashIn from "@/pages/User/AddMoney/Add.Money";
import CashOut from "@/pages/User/WithDrawMoney/With.Draw.Money";
import SendMoney from "@/pages/User/sendMoney/Send.money";
import SendMoneyRequest from "@/pages/User/wallet/SendMoneyRequest";
import User_Profile from "@/components/user/User.Profile";

export const userSidebarItems: ISidebarItem[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                url: "/user/dashboard",
                component: UserDashboard,
            },
            {
                title:"My-Profile",
                url:"/user/myProfile",
                component:User_Profile
            }
           ,
            {
                title:"My-Wallet",
                url:"/user/myWallet",
                component:Wallet
            }
           ,
            {
                title:"AddMoney",
                url:"/user/addMoney",
                component:CashIn
            }
        ,
            {
                title:"WithdrawMoney",
                url:"/user/withdrawMoney",
                component:CashOut
            }
        ,
            {
                title:"Send-Money",
                url:"/user/sendMoney",
                component:SendMoney
            },
            
            {
                title:"Req-Money",
                url:"/user/reqMoney",
                component:SendMoneyRequest
            }

        ],
    },
    
];