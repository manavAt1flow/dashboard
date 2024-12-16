import UserAvatar from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import OrganizationSelector from "./organization-selector";
import SidebarSearch from "./topbar-search";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center w-full py-1 px-2">
      <div className="flex items-center justify-between gap-2 w-[13rem]">
        <img src="/meta/logo.svg" className="w-10 h-10" />
        <OrganizationSelector />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm">Upgrade</Button>
        <UserAvatar />
      </div>
    </div>
  );
}
