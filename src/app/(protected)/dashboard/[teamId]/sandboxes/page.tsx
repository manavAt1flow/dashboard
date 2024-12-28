"use client";

import { DashboardPageHeader } from "@/components/globals/dashboard-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SandboxesTable } from "@/components/sandboxes/sandboxes-table";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";

export default function Page() {
  return (
    <DashboardPageLayout>
      <div className="flex flex-col gap-6">
        <DashboardPageHeader
          title="Sandboxes"
          description="View and manage your E2B Sandboxes."
        />

        <Card className="border-none">
          <CardHeader>
            <CardTitle>Running Sandboxes</CardTitle>
            <CardDescription>
              View and manage your active sandbox environments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SandboxesTable />
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
