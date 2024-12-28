import { DashboardPageHeader } from "@/components/globals/dashboard-page-header";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";

export default function Page() {
  return (
    <DashboardPageLayout>
      <DashboardPageHeader title="Templates" />
    </DashboardPageLayout>
  );
}
