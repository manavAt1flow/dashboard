import {
  Blocks,
  HomeIcon,
  LucideSheet,
  Settings,
  User,
  Users,
} from "lucide-react";

type SidebarLinkArgs = {
  teamId?: string;
};

export type SidebarLink = {
  label: string;
  href: (args: SidebarLinkArgs) => string;
  icon: React.ComponentType;
  group?: string;
};

export const MAIN_SIDEBAR_LINKS: SidebarLink[] = [
  {
    label: "Home",
    href: (args) => `/dashboard/${args.teamId}`,
    icon: HomeIcon,
  },
  {
    label: "Sandboxes",
    href: (args) => `/dashboard/${args.teamId}/sandboxes`,
    icon: Blocks,
  },
  {
    label: "Templates",
    href: (args) => `/dashboard/${args.teamId}/sandboxes`,
    icon: LucideSheet,
  },
  {
    label: "Settings",
    icon: Settings,
    href: (args) => `/dashboard/${args.teamId}/settings/general`,
  },
];

export const SETTINGS_SIDEBAR_LINKS: SidebarLink[] = [
  {
    label: "General",
    href: (args) => `/dashboard/${args.teamId}/settings/general`,
    icon: Users,
    group: "organization",
  },

  {
    label: "Account",
    href: () => `/dashboard/account`,
    icon: User,
    group: "account",
  },
];
