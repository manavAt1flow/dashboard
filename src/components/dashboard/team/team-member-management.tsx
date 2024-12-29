"use client";

import { addTeamMemberAction } from "@/actions/team-actions";
import { AuthFormMessage } from "@/components/auth/auth-form-message";
import MemberTable from "@/components/dashboard/team/team-member-table";
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
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useState } from "react";
import { z } from "zod";

export function MemberManagement() {
  const { teamId } = useParams();
  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [message, setMessage] = useTimeoutMessage();

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!z.string().email().safeParse(addMemberEmail).success) {
      setMessage({ error: "Invalid email address" });
      return;
    }

    startTransition(async () => {
      try {
        await addTeamMemberAction(teamId as string, addMemberEmail);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TEAM_MEMBERS(teamId as string),
        });
        setMessage({ success: "Member added to team" });
        setAddMemberEmail("");
      } catch (error: any) {
        setMessage({ error: error.message });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Manage your organization members.</CardDescription>
      </CardHeader>
      <CardContent className="pt-10">
        <form onSubmit={handleAddMember} className="mb-6 flex w-1/2 gap-2">
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
            loading={isPending}
            type="submit"
            disabled={addMemberEmail.length === 0}
          >
            Add Member
          </Button>
        </form>

        <AnimatePresence mode="wait" initial={false}>
          {message && <AuthFormMessage className="mb-6" message={message} />}
        </AnimatePresence>

        <MemberTable />
      </CardContent>
    </Card>
  );
}
