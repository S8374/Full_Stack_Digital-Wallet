// src/components/layout/AppSidebar.tsx
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { useDispatch } from "react-redux";

export function AppSidebar() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const { data: userData } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation(undefined);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const sidebarItems = getSidebarItems(userData?.data?.role);
  console.log(sidebarItems)
  const handleLogout = async () => {
    await logout(undefined);
    navigate('/')
    dispatch(authApi.util.resetApiState());
  };
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar className="bg-white dark:bg-gray-900 border-r shadow-sm fixed left-0 top-0 h-full w-64">
        <SidebarHeader className="p-6 border-b">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
            DIGITAL WALLET
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {userData?.data?.email}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {sidebarItems.map((section) => (
              <SidebarGroup key={section.title}>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {/* {section.title} */}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === item.url}
                          >
                            <Link
                              to={item.url}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                            >

                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {/* Logout Button */}
            <SidebarGroup className="mt-auto pt-4 border-t">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export default AppSidebar;