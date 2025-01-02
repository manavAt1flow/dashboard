"use client";

import SandboxesTable from "@/components/dashboard/sandboxes/sandboxes-table";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";

export default function Page() {
  return (
    <DashboardPageLayout
      title="Sandboxes"
      description="View and manage your E2B Sandboxes."
    >
      <h2 className="text-2xl font-medium normal-case">Active Sandboxes</h2>
      <p className="mb-4 text-sm text-fg-500">
        View and manage your active sandbox environments.
      </p>
      <SandboxesTable />
    </DashboardPageLayout>
  );
}
