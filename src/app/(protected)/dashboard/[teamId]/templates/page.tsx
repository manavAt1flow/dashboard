import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import TemplatesTable from "@/components/dashboard/templates/templates-table";

export default function Page() {
  return (
    <DashboardPageLayout
      title="Templates"
      description="View and manage your templates."
    >
      <p className="mb-4 text-sm text-fg-500">
        View and manage your active sandbox templates.
      </p>
      <TemplatesTable />
    </DashboardPageLayout>
  );
}
