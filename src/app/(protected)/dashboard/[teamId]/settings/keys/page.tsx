"use client";

import ApiKeysTable from "@/components/dashboard/keys/api-keys-table";
import DashboardPageTitle from "@/components/globals/dashboard-page-title";
import { useMetadata } from "@/components/providers/metadata-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function KeysPage() {
  const { lastTeamId } = useMetadata();

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageTitle>API Keys</DashboardPageTitle>

      {lastTeamId && (
        <Card hideUnderline>
          <CardHeader>
            <CardTitle>Manage Organization Keys</CardTitle>
            <CardDescription>
              Organization keys are used to authenticate API requests from your
              organization's applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysTable teamId={lastTeamId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
