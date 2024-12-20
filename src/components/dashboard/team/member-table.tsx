"use client";

import { getTeamMembersAction } from "@/actions/team-actions";
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
import { useQuery } from "@tanstack/react-query";

interface MemberTableProps {
  teamId: string;
}

export default function MemberTable({ teamId }: MemberTableProps) {
  const { data: userData } = useUser();

  const {
    data: members,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_MEMBERS(teamId),
    queryFn: () => getTeamMembersAction(teamId),
    enabled: !!teamId,
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
                      )?.user.name ?? "")}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {userData?.user?.id === member.user.id ? (
                    <Button variant="muted" size="sm">
                      <span className="text-xs"> Leave Team</span>
                    </Button>
                  ) : (
                    <Button variant="error" size="iconSm">
                      <span className="text-xs">X</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
