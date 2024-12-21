"use client";

import { getTeamApiKeysAction } from "@/actions/key-actions";
import { queryClient } from "@/components/globals/client-providers";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";

interface ApiKeysTableProps {
  teamId: string;
}

const ApiKeysTable: FC<ApiKeysTableProps> = ({ teamId }) => {
  // queries
  const { data: keysData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_API_KEYS(teamId),
    queryFn: () => getTeamApiKeysAction(teamId),
  });

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center gap-3 px-6 py-4">
          Loading Keys
          <Loader variant="line" />
        </div>
      )}

      {!isLoading && keysData && (
        <Table className="animate-in fade-in">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created At</TableHead>
              <th></th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keysData.apiKeys.map((key, index) => (
              <TableRow key={`${key.name}-${index}`}>
                <TableCell>{key.name}</TableCell>
                <TableCell className="font-mono text-xs">
                  {key.masked_key}
                </TableCell>
                {/* <TableCell className="max-w-36 overflow-hidden truncate text-fg-500">
                  <span className="max-w-full truncate"></span>
                  </TableCell> */}
                <TableCell className="text-center text-fg-300">
                  {key.created_at
                    ? new Date(key.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="muted" size="sm" className="text-xs">
                    <MoreHorizontal className="size-4" />
                  </Button>
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
