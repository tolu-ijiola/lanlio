'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/global/sidebar";
import Header from "@/components/global/authheader";

interface AppClientWrapperProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: AppClientWrapperProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header/>
        <div className="flex flex-1">
          {/* Desktop Sidebar - Always visible, icon only */}
          <div className="hidden md:flex ">
            <AppSidebar />
          </div>
          <main className="flex-1 ml-28 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
