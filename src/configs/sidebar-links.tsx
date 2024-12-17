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

type SidebarLinkGroup = "team" | "account";

export type SidebarLink = {
  label: string;
  href: (args: SidebarLinkArgs) => string;
  icon: React.ComponentType;
  group?: SidebarLinkGroup;
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
    href: (args) => `/dashboard/${args.teamId}/settings/team`,
  },
];

export const SETTINGS_SIDEBAR_LINKS: SidebarLink[] = [
  {
    label: "Team",
    href: (args) => `/dashboard/${args.teamId}/settings/team`,
    icon: Users,
    group: "team",
  },

  {
    label: "Account",
    href: (args) => `/dashboard/${args.teamId}/settings/account`,
    icon: User,
    group: "account",
  },
];
