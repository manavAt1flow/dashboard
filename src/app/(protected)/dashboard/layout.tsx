import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full gap-2">
      <Sidebar />
      <div className="flex-1 pb-4 pl-2 pr-4">
        <div className="relative h-full max-h-full w-full overflow-y-auto">
          <div className="mx-auto max-w-4xl py-14">{children}</div>
        </div>
      </div>
    </div>
  );
}
