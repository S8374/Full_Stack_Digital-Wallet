// src/utils/sidebarUtils.ts
import { role } from "@/constant/role";
import { adminSidebarItems } from "@/routes/Admin.Sidebar,Items";
import { agentSidebarItems } from "@/routes/Agent.Sidebar.Items";
import { userSidebarItems } from "@/routes/User.Sidebar.Items";
import type { TRole } from "@/types/index.types";
import type { ISidebarItem } from "@/types/index.types";

export const getSidebarItems = (userRole: TRole): ISidebarItem[] => {
  console.log('user role',userRole)
  switch (userRole) {
    case role.user:
      return userSidebarItems;
    case role.agent:
      return agentSidebarItems; // Add agent sidebar items
    case role.admin:
      return adminSidebarItems; // Add admin sidebar items
    default:
      return [];
  }
};