"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { DebouncedInput, Input } from "@/components/ui/input";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Sandbox } from "@/types/api";
import { QUERY_KEYS } from "@/configs/query-keys";
import { getTeamSandboxesAction } from "@/actions/sandboxes-actions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export default function SandboxesTable() {
  "use no memo";

  const { teamId } = useParams();

  const { data: sandboxesData, isLoading: sandboxesLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_SANDBOXES(teamId as string),
    queryFn: () =>
      getTeamSandboxesAction({
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        teamId: teamId as string,
      }),
  });

  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data: sandboxesData?.type === "success" ? sandboxesData.data : [],
    columns: COLUMNS,
    state: {
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="mb-4">
        <DebouncedInput
          value={globalFilter}
          onChange={(v) => setGlobalFilter(v as string)}
          placeholder="Search all columns..."
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {header.isPlaceholder
                    ? ""
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getFilteredRowModel().rows?.length ? (
            table.getFilteredRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} className="h-24 text-center">
                No sandboxes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const COLUMNS: ColumnDef<Sandbox>[] = [
  {
    accessorKey: "alias",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("alias")}</div>
    ),
  },
  {
    accessorKey: "sandboxID",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-fg-500">
        {row.getValue("sandboxID")}
      </div>
    ),
  },
  {
    accessorKey: "cpuCount",
    header: "CPU",
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("cpuCount")}x vCPU</div>
    ),
  },
  {
    accessorKey: "memoryMB",
    header: "Memory",
    cell: ({ row }) => (
      <div className="font-mono">
        {(row.getValue("memoryMB") as number) / 1024}GB RAM
      </div>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {formatDistanceToNow(new Date(row.getValue("startedAt")), {
          addSuffix: true,
        })}
      </div>
    ),
  },
  {
    accessorKey: "endAt",
    header: "Duration",
    cell: ({ row }) => {
      const start = new Date(row.getValue("startedAt"));
      const end = new Date(row.getValue("endAt"));
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return (
        <div className="font-mono text-xs">{duration.toFixed(1)} hours</div>
      );
    },
  },
];
