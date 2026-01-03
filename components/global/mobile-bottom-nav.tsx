"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, User, BarChart2, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Websites",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: FileText,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Stats",
    url: "/dashboard/stats",
    icon: BarChart2,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-14 px-1 sm:px-2 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.url === "/dashboard" 
            ? pathname === "/dashboard" || pathname === "/dashboard/website"
            : pathname === item.url || (pathname.startsWith(item.url + "/") && item.url !== "/dashboard");
          
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 h-full rounded-lg transition-colors px-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium truncate w-full text-center leading-tight">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

