import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { TeamSettingsForm } from "@/components/dashboard/team/team-settings-form";
import { MemberManagement } from "@/components/dashboard/team/team-member-management";
import { DangerZone } from "@/components/dashboard/team/team-danger-zone";

export default function GeneralPage() {
  return (
    <DashboardPageLayout title="General">
      <div className="flex flex-col gap-6">
        <TeamSettingsForm />
        <MemberManagement />
        <DangerZone />
      </div>
    </DashboardPageLayout>
  );
}
