import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
// import { MobileNavbar } from "../Mobile Navbar/MobileNavbar";
import "../../App.css";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-auto">
        {/* Sidebar with fixed width */}
        <div className="w-[320px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <SidebarInset className="flex flex-col w-[100dvw] h-full flex-1 items-center justify-center p-4 bg-cover bg-center relative overflow-y-auto">
          {/* <MobileNavbar /> */}
          <main className="flex-1 w-full overflow-y-auto py-[calc(0.5rem+0.2rem)] px-[calc(0.2rem+0.1rem)] no-scrollbar">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
