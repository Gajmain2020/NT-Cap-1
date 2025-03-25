import useAuthStore from "@/store/userAuthStore";
import { ChevronUp, User2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { hrNavItems, interviewerNavItems } from "@/utils/navItems";
import { useState } from "react";
import LOGO from "../../../public/LogoIE2.png";
import PasswordChangeDialog from "./PasswordChangeDialog";
import SidebarNavItem from "./SidebarNavItem";

export function AppSidebar() {
  const navigate = useNavigate();
  const { name, id, userType, reset } = useAuthStore();
  const { state } = useSidebar();

  const location = useLocation();

  const activePath = location.pathname;
  const basePath = `/user/${userType}/${id}`;
  const navItems = userType === "hr" ? hrNavItems : interviewerNavItems;

  const [changePassword, setChangePassword] = useState(false);

  function handleLogout() {
    reset();

    //! using setTimeout just for considering hydration issue
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  }

  return (
    <>
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
                      setChangePassword(true);
                    }}
                    className="cursor-pointer"
                  >
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLogout()}
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

      {/* dialog component for password changing */}
      <PasswordChangeDialog open={changePassword} setOpen={setChangePassword} />
    </>
  );
}
