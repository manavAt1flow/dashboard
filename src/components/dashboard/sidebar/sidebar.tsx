import SidebarSearch from "../topbar/topbar-search";
import SidebarNav from "./sidebar-nav";

export default async function Sidebar() {
  return (
    <div className="flex flex-col gap-3 w-56 pb-4 pl-4">
      <SidebarSearch className="h-8 w-full" />
      <SidebarNav />
    </div>
  );
}
