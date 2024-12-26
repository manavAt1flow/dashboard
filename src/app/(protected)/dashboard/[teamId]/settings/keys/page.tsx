"use client";

import ApiKeysTable from "@/components/dashboard/keys/api-keys-table";
import CreateApiKeyDialog from "@/components/dashboard/keys/create-api-key-dialog";
import { DashboardPageHeader } from "@/components/globals/dashboard-page-header";
import { useMetadata } from "@/components/providers/metadata-provider";
import { Button } from "@/components/ui/button";
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
      <DashboardPageHeader title="API Keys" />

      {lastTeamId && (
        <Card hideUnderline className="relative">
          <CardHeader>
            <CardTitle>Manage Organization Keys</CardTitle>
            <CardDescription>
              Organization keys are used to authenticate API requests from your
              organization's applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateApiKeyDialog teamId={lastTeamId}>
              <Button className="absolute right-6 top-6">CREATE KEY</Button>
            </CreateApiKeyDialog>
            <ApiKeysTable teamId={lastTeamId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
