"use client";

import { Calendar, Home, Inbox, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions/auth";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Vehicles Booking",
    url: "/bookings",
    icon: Inbox,
  },
  {
    title: "Vehicle Managements",
    url: "/managements",
    icon: Calendar,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Search,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <form action={logout} className="w-full">
                  <SidebarMenuButton asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      Logout
                    </Button>
                  </SidebarMenuButton>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
