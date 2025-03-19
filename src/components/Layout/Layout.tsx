import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
// import { MobileNavbar } from "../Mobile Navbar/MobileNavbar";
import "../../App.css";
import { AppSidebar } from "../Sidebar/Sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-auto relative">
        {/* Sidebar with fixed width */}
        <AppSidebar />
        <div className="absolute z-10 top-2 left-1">
          <SidebarTrigger />
        </div>

        {/* Main content area */}
        <SidebarInset className="flex flex-col h-full flex-1 items-center justify-center p-2 bg-cover bg-center relative overflow-y-auto">
          {/* <MobileNavbar /> */}
          <main className="flex-1 w-full overflow-y-auto no-scrollbar">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
