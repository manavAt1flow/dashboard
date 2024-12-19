"use client";

import { updateTeamNameAction } from "@/actions/team-actions";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import ChangeDataInput from "@/components/globals/change-data-input";
import { useMetadata } from "@/components/providers/metadata-provider";
import { useTeams } from "@/components/providers/teams-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { z } from "zod";

export default function OrganizationSettings() {
  const { lastTeamId } = useMetadata();
  const { data: teamsData, setData: setTeamsData } = useTeams();

  const selectedTeam = teamsData?.teams.find((team) => team.id === lastTeamId);

  // states
  const [teamName, setTeamName] = useState(selectedTeam?.name ?? "");
  const [teamNameMessage, setTeamNameMessage] = useState<AuthMessage | null>(
    null,
  );

  // mutations
  const { mutate: mutateTeamName, isPending: isMutatingTeamName } = useMutation(
    {
      mutationKey: ["updateTeamName"],
      mutationFn: async (name: string) => {
        if (!selectedTeam) throw new Error("No team selected");

        return await updateTeamNameAction(selectedTeam.id, name);
      },
      onSuccess: (result) => {
        setTeamsData((prev) => {
          return {
            ...prev!,
            teams: prev!.teams.map((team) =>
              team.id === result.id ? result : team,
            ),
          };
        });

        setTeamNameMessage({ success: "Team name updated" });
      },
      onError: (error) => {
        setTeamNameMessage({ error: error.message });
      },
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Organization Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Organization Name</CardTitle>
          <CardDescription>
            Change your organization name to display on your invoices and
            receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangeDataInput
            placeholder="Acme, Inc."
            className="w-[17rem]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            hasChanges={teamName !== selectedTeam?.name}
            isLoading={isMutatingTeamName}
            onSave={() => {
              if (!z.string().min(1).safeParse(teamName).success) {
                setTeamNameMessage({ error: "Name cannot be empty" });
                return;
              }

              mutateTeamName(teamName);
            }}
          />
          <AnimatePresence mode="wait" initial={false}>
            {teamNameMessage && (
              <AuthFormMessage className="mt-4" message={teamNameMessage} />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
