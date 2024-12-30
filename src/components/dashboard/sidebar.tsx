"use client";

import { HeartPulse } from "lucide-react";
import UserMenu from "../auth/user-menu";
import { ThemeSwitcher } from "../globals/theme-switcher";
import { Button } from "../ui/button";
import DashboardNav from "./dashboard-nav";
import TeamSelector from "./team-selector";
import LogoWithoutText from "../globals/logo-without-text";

export default function Sidebar() {
  return (
    <aside className="relative flex w-56 flex-col gap-3 bg-gradient-to-b from-bg-200 from-80% to-transparent to-20% bg-[length:1px_22px] bg-right-top bg-repeat-y">
      <span className="inline-flex items-center">
        <LogoWithoutText className="size-12" />
        <span className="font-mono text-xs text-fg-300">E2B</span>
      </span>
      <DashboardNav />

      <TeamSelector />
      <div className="flex items-center justify-between gap-2 pr-2">
        <UserMenu />
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" className="size-8">
            <HeartPulse className="h-4 w-4 text-fg-300" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
