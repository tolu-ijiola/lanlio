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
        <div className="flex flex-1 min-w-0">
          {/* Desktop Sidebar - Always visible, icon only */}
          <div className="hidden md:flex flex-col justify-center items-center shrink-0">
            <AppSidebar />
          </div>
          <main className="flex-1 md:ml-28 w-full min-w-0">
            <div className="w-full px-4 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
