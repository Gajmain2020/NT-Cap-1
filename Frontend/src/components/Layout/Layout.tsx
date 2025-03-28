import {
  SidebarInset,
  SidebarProvider,
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
        <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden p-2 bg-cover bg-center relative">
          {/* <MobileNavbar /> */}
          <main className="flex-1 w-full overflow-auto no-scrollbar flex flex-col gap-4 container mx-auto">
            <div className="lg:text-3xl sticky bg-gray-300/30 backdrop-blur shadow top-0 text-xl text-gray-800 text-center font-semibold">
              INTERVIEW FEEDBACK <br /> MANAGEMENT SYSTEM
            </div>
            <div>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
