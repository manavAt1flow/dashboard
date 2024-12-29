"use client";

import { AlertDialog } from "@/components/globals/alert-dialog";
import { useMetadata } from "@/components/providers/metadata-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTeams } from "@/hooks/use-teams";
import { useMemo } from "react";

export function DangerZone() {
  const { teams } = useTeams();
  const { selectedTeamId } = useMetadata();

  const team = useMemo(
    () => teams?.find((team) => team.id === selectedTeamId),
    [teams, selectedTeamId],
  );

  return (
    <Card className="[border-bottom:1px_solid_hsl(var(--error))]">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Actions here can't be undone. Please proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium">Leave Organization</h4>
            <p className="font-sans text-sm text-fg-500">
              Remove yourself from this organization
            </p>
          </div>

          <AlertDialog
            title="Leave Team"
            description="Are you sure you want to leave this team?"
            confirm="Leave"
            onConfirm={() => {}}
            trigger={
              <Button variant="muted" disabled={!team || team?.is_default}>
                Leave Organization
              </Button>
            }
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <h4 className="font-medium text-fg">Delete Organization</h4>
            <p className="font-sans text-sm text-fg-500">
              Permanently delete this organization and all of its data
            </p>
          </div>
          <Button variant="error">Delete Organization</Button>
        </div>
      </CardContent>
    </Card>
  );
}
