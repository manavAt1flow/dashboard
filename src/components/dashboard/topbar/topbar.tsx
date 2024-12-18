import UserAvatar from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import TeamSelector from "./team-selector";
import { HeartPulse } from "lucide-react";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center w-full py-2 px-2">
      <div className="flex items-center justify-between gap-2 w-[13rem]">
        <img src="/meta/logo.svg" className="w-10 h-10" />

        <TeamSelector />
      </div>

      <div className="flex items-center gap-2 pr-2">
        <Button variant="outline" size="icon" className="size-8 border-fg-400">
          <HeartPulse className="w-4 h-4 text-fg-300" />
        </Button>
        <UserAvatar />
        <Button size="sm">Upgrade</Button>
      </div>
    </div>
  );
}
