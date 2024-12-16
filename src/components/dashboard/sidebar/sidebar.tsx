import SidebarSearch from "../topbar/topbar-search";

export default async function Sidebar() {
  return (
    <div className="flex flex-col w-56 p-2">
      <div className="pl-2 w-full">
        <SidebarSearch className="h-8 w-full" />
      </div>
    </div>
  );
}
