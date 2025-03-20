import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LOGO from "../../assets/logo.svg";
import { hrNavItems, interviewerNavItems } from "@/utils/navItems";
import { ChevronUp, User2 } from "lucide-react";
import useAuthStore from "@/store/userAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface INavItem {
  title: string;
  icon: React.ComponentType;
  url: string;
}
interface ISidebarNavItem {
  item: INavItem;
  isActive: boolean;
  onClick: () => void;
  path: string;
}
const SidebarNavItem = ({ item, isActive, path }: ISidebarNavItem) => (
  <SidebarMenuItem key={item.title}>
    <SidebarMenuButton asChild tooltip={item.title}>
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-2 rounded-md ${
          isActive
            ? "bg-slate-600/30 text-black font-semibold hover:bg-slate-800/30 transition-all"
            : "hover:bg-slate-600/10"
        }`}
      >
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AppSidebar() {
  const navigate = useNavigate();
  const { name, id, userType } = useAuthStore();
  const { state } = useSidebar();

  const location = useLocation();

  const activePath = location.pathname;
  const basePath = `/user/${userType}/${id}`;
  const navItems = userType === "hr" ? hrNavItems : interviewerNavItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-center py-10">
            <img src={LOGO} alt="Company" />
          </div>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const path = `${basePath}${item.url}`;
                const isHome =
                  item.url === "/" &&
                  (activePath === basePath || activePath === `${basePath}/`);
                const isActive =
                  isHome || (activePath.startsWith(path) && item.url !== "/"); // Prevent "Home" from being active when in other pages

                return (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    path={path}
                    isActive={isActive}
                    onClick={() => navigate(path, { replace: true })}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Sidebar Footer with User Info and Logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {state === "expanded" && (
                    <>
                      <span>{name}</span>
                      <ChevronUp className="ml-auto" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem
                  onClick={() => {
                    console.log("change password requested");
                  }}
                  className="cursor-pointer"
                >
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("logout requested")}
                  className="cursor-pointer"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
