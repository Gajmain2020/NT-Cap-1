import { ISidebarNavItem } from "@/utils/types";
import { Link } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

const SidebarNavItem = ({ item, isActive, path }: ISidebarNavItem) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild tooltip={item.title}>
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-md ${
          isActive
            ? "bg-teal-600/30 text-black font-semibold hover:bg-teal-700/30 transition-all"
            : "hover:bg-teal-600/10"
        }`}
      >
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
export default SidebarNavItem;
