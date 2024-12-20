import UserAvatar from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import TeamSelector from "./team-selector";
import { HeartPulse } from "lucide-react";
import { ThemeSwitcher } from "@/components/globals/theme-switcher";

export default function Topbar() {
  return (
    <div className="flex w-full items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <img src="/meta/logo.svg" className="h-10 w-10" />

        <TeamSelector />
      </div>

      <div className="flex items-center gap-2 pr-2">
        <Button variant="ghost" size="icon" className="size-8">
          <HeartPulse className="h-4 w-4 text-fg-300" />
        </Button>
        <ThemeSwitcher />
        <UserAvatar />
        <Button size="sm">Upgrade</Button>
      </div>
    </div>
  );
}
