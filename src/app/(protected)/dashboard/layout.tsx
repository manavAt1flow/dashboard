import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full gap-2">
      <Sidebar />
      <div className="flex-1 pl-2 pr-4 pb-4">
        <div className="bg-bg-300 h-full w-full relative border-4 border-bg-200 overflow-y-auto max-h-full">
          <div className="max-w-4xl mx-auto py-14">{children}</div>
        </div>
      </div>
    </div>
  );
}
