import { Blocks, HomeIcon, LucideSheet, Settings, Users } from "lucide-react";

export const MAIN_SIDEBAR_LINKS = [
  {
    label: "Home",
    href: (orgId: string) => `/dashboard/${orgId}`,
    icon: HomeIcon,
  },
  {
    label: "Sandboxes",
    href: (orgId: string) => `/dashboard/${orgId}/sandboxes`,
    icon: Blocks,
  },
  {
    label: "Templates",
    href: (orgId: string) => `/dashboard/${orgId}/sandboxes`,
    icon: LucideSheet,
  },
  {
    label: "Settings",
    icon: Settings,
    href: (orgId: string) => `/dashboard/${orgId}/settings/team`,
  },
];

export const TEAM_SIDEBAR_LINKS = [
  {
    label: "Team",
    href: (teamId: string) => `/dashboard/${teamId}/settings/team`,
    icon: Users,
  },
];
