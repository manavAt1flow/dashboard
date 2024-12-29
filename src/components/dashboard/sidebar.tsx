"use client";

import { HeartPulse } from "lucide-react";
import UserMenu from "../auth/user-menu";
import { ThemeSwitcher } from "../globals/theme-switcher";
import { Button } from "../ui/button";
import DashboardNav from "./dashboard-nav";
import TeamSelector from "./team-selector";
import { useWindowSize } from "usehooks-ts";
import LogoWithoutText from "../globals/logo-without-text";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function Sidebar() {
  const { height } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = Math.floor(height / 18.8);

  return (
    <aside className="relative flex w-56 flex-col gap-3">
      <span className="inline-flex items-center">
        <LogoWithoutText />
        <span className="font-mono text-xs text-fg-300">E2B</span>
      </span>
      <DashboardNav />

      <TeamSelector />
      <div className="flex items-center gap-2 pr-2">
        <UserMenu />
        <Button size="sm">Upgrade</Button>
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="size-8">
          <HeartPulse className="h-4 w-4 text-fg-300" />
        </Button>
      </div>

      <div
        className="absolute right-0 h-full select-none font-mono text-bg-100"
        aria-hidden="true"
      >
        {isMounted &&
          Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="leading-[1.15]">
              |
            </div>
          ))}
      </div>
    </aside>
  );
}
