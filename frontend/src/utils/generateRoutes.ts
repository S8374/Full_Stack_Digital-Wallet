import type { ISidebarItem } from "@/types/index.types";

export const generateRoutes = (sidebarItems: ISidebarItem[]) => {
  console.log("sidebarItems", sidebarItems);

  return sidebarItems.flatMap((section) =>
    section.items.map((route) => {
      console.log("route", route);
      return {
        path: route.url,
        Component: route.component,
      };
    })
  );
};
