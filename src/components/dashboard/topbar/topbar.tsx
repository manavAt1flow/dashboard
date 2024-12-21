"use client";

import { Button } from "@/components/ui/button";
import TeamSelector from "./team-selector";
import { HeartPulse } from "lucide-react";
import { ThemeSwitcher } from "@/components/globals/theme-switcher";
import dynamic from "next/dynamic";
import UserMenu from "@/components/auth/user-menu";

const Logo = dynamic(() => import("@/components/globals/logo-without-text"), {
  ssr: false,
});

export default function Topbar() {
  return (
    <header className="w-full">
      <nav className="flex w-full items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <Logo />
          <TeamSelector />
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Button variant="ghost" size="icon" className="size-8">
            <HeartPulse className="h-4 w-4 text-fg-300" />
          </Button>
          <ThemeSwitcher />
          <UserMenu />
          <Button size="sm">Upgrade</Button>
        </div>
      </nav>
    </header>
  );
}
