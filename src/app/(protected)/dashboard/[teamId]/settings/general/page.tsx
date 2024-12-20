"use client";

import {
  addTeamMemberAction,
  updateTeamNameAction,
} from "@/actions/team-actions";
import {
  AuthFormMessage,
  AuthMessage,
} from "@/components/auth/auth-form-message";
import MemberTable from "@/components/dashboard/team/member-table";
import ChangeDataInput from "@/components/globals/change-data-input";
import { queryClient } from "@/components/globals/client-providers";
import DashboardPageTitle from "@/components/globals/dashboard-page-title";
import { useMetadata } from "@/components/providers/metadata-provider";
import { useTeams } from "@/components/providers/teams-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
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

  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberMessage, setAddMemberMessage] = useState<AuthMessage | null>(
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

  const { mutate: mutateAddMember, isPending: isMutatingAddMember } =
    useMutation({
      mutationKey: ["addMember"],
      mutationFn: async (email: string) => {
        if (!selectedTeam) throw new Error("No team selected");

        return await addTeamMemberAction(selectedTeam.id, email);
      },
      onSuccess: (result) => {
        setAddMemberMessage({ success: "Member added to team" });

        if (!selectedTeam) return;

        // invalidate team members query to force a re-fetch
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TEAM_MEMBERS(selectedTeam.id),
        });
      },
      onError: (error) => {
        setAddMemberMessage({ error: error.message });
      },
    });

  // message timeouts
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (addMemberMessage) {
        setAddMemberMessage(null);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [addMemberMessage]);

  useEffect(() => {
    if (!teamNameMessage) return;

    const timeout = setTimeout(() => {
      setTeamNameMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [teamNameMessage]);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageTitle>General</DashboardPageTitle>
      <Card hideUnderline>
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

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage your organization members.</CardDescription>
        </CardHeader>
        <CardContent className="pt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!z.string().email().safeParse(addMemberEmail).success) {
                setAddMemberMessage({ error: "Invalid email address" });
                return;
              }

              mutateAddMember(addMemberEmail);
            }}
            className="mb-6 flex w-1/2 gap-2"
          >
            <div className="relative w-full">
              <Label
                className="absolute bottom-[115%] left-1 text-xs text-fg-300"
                htmlFor="addMemberEmail"
              >
                E-Mail
              </Label>
              <Input
                placeholder="member@acme.com"
                name="addMemberEmail"
                value={addMemberEmail}
                onChange={(e) => setAddMemberEmail(e.target.value)}
              />
            </div>
            <Button
              loading={isMutatingAddMember}
              type="submit"
              disabled={addMemberEmail.length === 0}
            >
              Add Member
            </Button>
          </form>

          <AnimatePresence mode="wait" initial={false}>
            {addMemberMessage && (
              <AuthFormMessage className="mb-6" message={addMemberMessage} />
            )}
          </AnimatePresence>

          <MemberTable teamId={selectedTeam?.id ?? ""} />
        </CardContent>
      </Card>

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
            <Button variant="muted">Leave Organization</Button>
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
    </div>
  );
}
