"use client";

import {
  deleteApiKeyAction,
  getTeamApiKeysAction,
} from "@/actions/key-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";

interface ApiKeysTableProps {
  teamId: string;
}

const ApiKeysTable: FC<ApiKeysTableProps> = ({ teamId }) => {
  // queries
  const {
    data: keysData,
    refetch: refetchKeys,
    isLoading: isLoadingKeys,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_API_KEYS(teamId),
    queryFn: () => getTeamApiKeysAction({ teamId }),
  });

  // mutations
  const { mutate: deleteKey, isPending: isDeletingKey } = useMutation({
    mutationFn: (apiKeyId: string) => deleteApiKeyAction({ teamId, apiKeyId }),
    onSuccess: () => {
      refetchKeys();
    },
  });

  return (
    <div className="w-full">
      {isLoadingKeys && (
        <div className="flex items-center gap-3 px-6 py-4">
          Loading Keys
          <Loader variant="progress" />
        </div>
      )}

      {!isLoadingKeys && keysData && (
        <Table className="animate-in fade-in">
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead className="text-right">Created By</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <th></th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keysData.apiKeys.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Alert>
                    <AlertTitle>No API Keys</AlertTitle>
                    <AlertDescription>
                      No API keys found for this team.
                    </AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            )}
            {keysData.apiKeys.map((key, index) => (
              <TableRow key={`${key.name}-${index}`}>
                <TableCell className="flex flex-col gap-1">
                  {key.name}
                  <span className="pl-1 font-mono text-fg-500">
                    {key.maskedKey}
                  </span>
                </TableCell>
                <TableCell className="max-w-36 overflow-hidden truncate text-right text-fg-500">
                  <span className="max-w-full truncate">{key.createdBy}</span>
                </TableCell>
                <TableCell className="text-right text-fg-300">
                  {key.createdAt
                    ? new Date(key.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="muted"
                        size="sm"
                        loading={isDeletingKey}
                        className="text-xs"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="text-error"
                        onClick={() => deleteKey(key.id)}
                      >
                        X Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ApiKeysTable;
