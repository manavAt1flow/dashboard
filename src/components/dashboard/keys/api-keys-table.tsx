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
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { AnimatePresence } from "motion/react";
import { AuthFormMessage } from "@/components/auth/auth-form-message";

interface ApiKeysTableProps {
  teamId: string;
}

const ApiKeysTable: FC<ApiKeysTableProps> = ({ teamId }) => {
  const [deleteMessage, setDeleteMessage] = useTimeoutMessage();

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
    mutationFn: async (apiKeyId: string) => {
      await deleteApiKeyAction({ teamId, apiKeyId });
      await refetchKeys();
    },
    onSuccess: () => {
      setDeleteMessage({
        success: "API key deleted successfully",
      });
    },
    onError: (error) => {
      setDeleteMessage({
        error: "Failed to delete API key",
      });
    },
  });

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {deleteMessage && (
          <AuthFormMessage className="mb-4" message={deleteMessage} />
        )}
      </AnimatePresence>
      <Table className="w-full animate-in fade-in">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Key</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <th></th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoadingKeys || isDeletingKey) && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-left">
                <Alert className="w-full text-left" variant="contrast2">
                  <AlertTitle className="flex items-center gap-2">
                    <Loader variant="compute" />
                    Loading keys...
                  </AlertTitle>
                  <AlertDescription>This may take a moment.</AlertDescription>
                </Alert>
              </TableCell>
            </TableRow>
          )}

          {!isLoadingKeys && keysData && keysData.apiKeys.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Alert className="text-left" variant="contrast2">
                  <AlertTitle>No API Keys</AlertTitle>
                  <AlertDescription>
                    No API keys found for this team.
                  </AlertDescription>
                </Alert>
              </TableCell>
            </TableRow>
          )}

          {!isLoadingKeys &&
            !isDeletingKey &&
            keysData &&
            keysData.apiKeys.map((key, index) => (
              <TableRow key={`${key.name}-${index}`}>
                <TableCell className="flex flex-col gap-1 text-left font-mono">
                  {key.name}
                  <span className="pl-1 text-fg-500">{key.maskedKey}</span>
                </TableCell>
                <TableCell className="max-w-36 overflow-hidden truncate text-fg-500">
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
    </>
  );
};

export default ApiKeysTable;
