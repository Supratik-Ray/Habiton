"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartColumn,
  Command,
  Frame,
  GalleryVerticalEnd,
  Hand,
  Home,
  Map,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createAuthClient } from "better-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";

const { useSession } = createAuthClient();

const links = [
  { name: "Home", icon: <Home />, url: "/dashboard/home" },
  { name: "Add Habit", icon: <Plus />, url: "/dashboard/addHabit" },
  { name: "Manage Habits", icon: <Hand />, url: "/dashboard/manageHabits" },
  { name: "Insights", icon: <ChartColumn />, url: "/dashboard/insights" },
  { name: "Profile", icon: <User />, url: "/dashboard/profile" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();
  const path = usePathname();
  if (isPending) return <p>Loading...</p>;
  if (!session) redirect("/login");
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h2 className="text-2xl font-bold px-4 py-2">Habiton</h2>
      </SidebarHeader>
      <SidebarContent>
        <nav className="gap-4 p-4 flex flex-col text-gray-700">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className={`flex gap-2 ${
                path.startsWith(link.url) ? "bg-black text-white" : ""
              } hover:bg-black cursor-pointer hover:text-white p-4 rounded-md`}
            >
              <span>{link.icon}</span>
              <span> {link.name}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
