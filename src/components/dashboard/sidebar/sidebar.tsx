import SidebarSearch from "../topbar/topbar-search";
import SidebarNav from "./sidebar-nav";

export default async function Sidebar() {
  return (
    <aside className="flex w-56 flex-col gap-3 pb-4 pl-4">
      <SidebarSearch className="w-full" />
      <SidebarNav />
    </aside>
  );
}
