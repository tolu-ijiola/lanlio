import {
  Award,
  Calendar,
  Coins,
  DollarSign,
  Home,
  Inbox,
  Gift,
  Search,
  Settings,
  Trophy,
  History,
  User,
  HelpCircle,
  Bell,
  HomeIcon,
  BarChart2,
  Globe,
  LayoutDashboard,
  FileText
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Websites",
    url: "/dashboard/website",
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

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="border rounded-full bg-[#F7F5F3] fixed top-1/2 -translate-y-1/2 border-sidebar-border left-4 h-fit w-20">
      <SidebarContent className="px-0 py-4 h-full overflow-y-auto flex flex-col items-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 flex flex-col items-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                variant="outline"
                className="h-12 w-12 hover:bg-transparent p-0 bg-transparent flex items-center justify-center"
                tooltip={{ children: "Home", hidden: false }}
              >
                <Link href="/dashboard">
                  <Image src="/logo.svg" alt="logo" className="size-10 bg-transparent" width={100} height={100} />
                  <span className="sr-only">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant="outline"
                    className="h-12 w-12 p-0 flex items-center justify-center"
                    asChild
                    tooltip={{ children: item.title, hidden: false }}
                  >
                    <Link href={item.url} className="flex items-center justify-center">
                      <item.icon className="h-6 w-6" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
