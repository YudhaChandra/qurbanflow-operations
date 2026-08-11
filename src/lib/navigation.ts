import {
  LayoutDashboard,
  Beef,
  Users,
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    label: "Operations",
    items: [
      {
        label: "Operational Board",
        to: "/",
        icon: LayoutDashboard,
        description: "Live processing pipeline for the active event",
      },
      {
        label: "Animals",
        to: "/animals",
        icon: Beef,
        description: "Registered animals and their processing state",
      },
      {
        label: "Teams",
        to: "/teams",
        icon: Users,
        description: "Operational teams and station assignments",
      },
    ],
  },
  {
    label: "Events",
    items: [
      {
        label: "Events",
        to: "/events",
        icon: CalendarDays,
        description: "Qurban events, schedules and stations",
      },
      {
        label: "Event Summary",
        to: "/summary",
        icon: ClipboardList,
        description: "Completion status of a finished event",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Users & Access",
        to: "/users",
        icon: ShieldCheck,
        description: "Committee members, roles and permissions",
      },
      {
        label: "Settings",
        to: "/settings",
        icon: Settings,
        description: "Workspace and operational preferences",
      },
    ],
  },
];