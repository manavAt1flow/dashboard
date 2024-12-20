"use client";

import {
  getTeamMembersAction,
  removeTeamMemberAction,
} from "@/actions/team-actions";
import { AlertDialog } from "@/components/globals/alert-dialog";
import { useTeams } from "@/components/providers/teams-provider";
import { useUser } from "@/components/providers/user-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/configs/query-keys";
import { PROTECTED_URLS } from "@/configs/urls";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { produce } from "immer";

interface MemberTableProps {
  teamId: string;
}

export default function MemberTable({ teamId }: MemberTableProps) {
  const { setData } = useTeams();
  const { data: userData } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  // states
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_MEMBERS(teamId),
    queryFn: () => getTeamMembersAction(teamId),
    enabled: !!teamId,
  });

  const { mutate: mutateRemoveMember, isPending: isMutatingRemoveMember } =
    useMutation({
      mutationFn: async (userId: string) => {
        await removeTeamMemberAction(teamId, userId);

        return userId;
      },
      onSuccess: (removedUserId) => {
        if (removedUserId === userData?.user?.id) {
          router.push(PROTECTED_URLS.DASHBOARD);

          setTimeout(() => {
            setData(
              produce((draft) => {
                draft!.teams = draft!.teams.filter(
                  (team) => team.id !== teamId,
                );
              }),
            );
          }, 1000);

          return toast({
            title: "You have left the team",
          });
        }

        refetch();
        toast({
          title: "Member removed",
          description: "The member has been removed from the team",
        });
      },
      onError: (error) => {
        toast({
          title: "Could not remove member",
          description: error.message,
          variant: "error",
        });
      },
      onSettled: () => {
        setRemoveDialogOpen(false);
      },
    });

  // TODO: test alert variants in ui

  return (
    <div className="w-full">
      {isLoading && (
        <Alert>
          <AlertDescription>Loading members...</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="error">
          <AlertDescription>
            Error loading members: {error?.message}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && !members?.length && (
        <Alert variant="contrast1">
          <AlertDescription>No members found</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && members && members.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.user.id}>
                <TableCell>{member.user.name ?? "Anonymous"}</TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  {member.relation.added_by === userData?.user?.id
                    ? "( You )"
                    : (members.find(
                        (m) => m.user.id === member.relation.added_by,
                      )?.user.name ?? "( Root )")}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {!member.relation.is_default &&
                    (userData?.user?.id === member.user.id ? (
                      <AlertDialog
                        title="Leave Team"
                        description="Are you sure you want to leave this team?"
                        confirm="Leave"
                        onConfirm={() => mutateRemoveMember(member.user.id)}
                        confirmProps={{
                          loading: isMutatingRemoveMember,
                        }}
                        trigger={
                          <Button variant="muted" size="sm" className="text-xs">
                            Leave Team
                          </Button>
                        }
                        open={removeDialogOpen}
                        onOpenChange={setRemoveDialogOpen}
                      />
                    ) : (
                      <AlertDialog
                        title="Remove Member"
                        description="Are you sure you want to remove this member from the team?"
                        confirm="Remove"
                        onConfirm={() => mutateRemoveMember(member.user.id)}
                        confirmProps={{
                          loading: isMutatingRemoveMember,
                        }}
                        trigger={
                          <Button variant="error" size="iconSm">
                            <span className="text-xs">X</span>
                          </Button>
                        }
                        open={removeDialogOpen}
                        onOpenChange={setRemoveDialogOpen}
                      />
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
