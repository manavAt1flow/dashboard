import {
  BarChart,
  Blocks,
  Key,
  LucideSheet,
  Settings,
  User,
  Users,
} from "lucide-react";

type DashboardNavLinkArgs = {
  teamId?: string;
};

export type DashboardNavLink = {
  label: string;
  href: (args: DashboardNavLinkArgs) => string;
  icon: React.ComponentType;
  group?: string;
  goesDeeper?: boolean;
};

export const MAIN_DASHBOARD_LINKS: DashboardNavLink[] = [
  /*   {
    label: "Home",
    href: (args) => `/dashboard/${args.teamId}`,
    icon: HomeIcon,
  }, */
  {
    label: "Sandboxes",
    href: (args) => `/dashboard/${args.teamId}/sandboxes`,
    icon: Blocks,
  },
  {
    label: "Templates",
    href: (args) => `/dashboard/${args.teamId}/templates`,
    icon: LucideSheet,
  },
  {
    label: "Settings",
    icon: Settings,
    href: (args) => `/dashboard/${args.teamId}/settings/general`,
    goesDeeper: true,
  },
];

export const SETTINGS_DASHBOARD_LINKS: DashboardNavLink[] = [
  {
    label: "General",
    href: (args) => `/dashboard/${args.teamId}/settings/general`,
    icon: Users,
  },
  {
    label: "API Keys",
    href: (args) => `/dashboard/${args.teamId}/settings/keys`,
    icon: Key,
  },
  {
    label: "Usage",
    href: (args) => `/dashboard/${args.teamId}/settings/usage`,
    icon: BarChart,
  },

  {
    label: "Account",
    href: () => `/dashboard/account`,
    icon: User,
    group: "personal",
  },
];
