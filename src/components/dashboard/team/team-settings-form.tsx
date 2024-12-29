"use client";

import { updateTeamNameAction } from "@/actions/team-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import ChangeDataInput from "@/components/globals/change-data-input";
import { useMetadata } from "@/components/providers/metadata-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/hooks/use-teams";
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useTransition } from "react";
import { useState } from "react";
import { z } from "zod";

export function TeamSettingsForm() {
  const { data: teams } = useTeams();
  const { selectedTeamId } = useMetadata();

  const team = useMemo(
    () => teams?.teams.find((team) => team.id === selectedTeamId),
    [teams, selectedTeamId],
  );

  const [isPending, startTransition] = useTransition();
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [message, setMessage] = useTimeoutMessage();

  useEffect(() => {
    if (!team) return;

    setTeamName(team.name);
  }, [team]);

  const handleUpdateName = useCallback(async () => {
    if (!team) {
      return;
    }

    if (!z.string().min(1).safeParse(teamName).success) {
      setMessage({ error: "Name cannot be empty" });
      return;
    }

    startTransition(async () => {
      try {
        await updateTeamNameAction(team.id, teamName);
        setMessage({ success: "Team name updated" });
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  }, [team]);

  return (
    <Card hideUnderline>
      <CardHeader>
        <CardTitle>Organization Name</CardTitle>
        <CardDescription>
          Change your organization name to display on your invoices and
          receipts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {team ? (
          <ChangeDataInput
            placeholder="Acme, Inc."
            className="w-[17rem]"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            hasChanges={teamName !== team?.name}
            isLoading={isPending}
            onSave={handleUpdateName}
          />
        ) : (
          <Skeleton
            width={50}
            waveSpeed={0.1}
            waveFrequency={0.1}
            waveAmplitude={0.5}
            height={2}
            className="h-10 w-[17rem]"
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {message && <AuthFormMessage className="mt-4" message={message} />}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
