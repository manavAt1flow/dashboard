"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { DebouncedInput } from "@/components/ui/input";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Template } from "@/types/api";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  DataTableHead,
  DataTableCell,
  DataTableRow,
} from "@/components/ui/data-table";
import { getTeamTemplatesAction } from "@/actions/templates-actions";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export default function TemplatesTable() {
  "use no memo";

  const { teamId } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_TEMPLATES(teamId as string),
    queryFn: () =>
      getTeamTemplatesAction({
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        teamId: teamId as string,
      }),
  });

  const table = useReactTable({
    data: templatesData?.type === "success" ? templatesData.data : [],
    columns: COLUMNS,
    state: {
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
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
            <DataTableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DataTableHead key={header.id} column={header.column}>
                  {header.isPlaceholder
                    ? ""
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </DataTableHead>
              ))}
            </DataTableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <DataTableRow key={row.id} isSelected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <DataTableCell
                    key={cell.id}
                    cell={flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  />
                ))}
              </DataTableRow>
            ))
          ) : (
            <DataTableRow>
              <TableCell colSpan={COLUMNS.length} className="h-24 text-center">
                No templates found.
              </TableCell>
            </DataTableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const COLUMNS: ColumnDef<Template>[] = [
  {
    accessorKey: "aliases",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-mono font-medium">
        {(row.getValue("aliases") as string[])[0]}
      </div>
    ),
  },
  {
    accessorKey: "templateID",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-fg-500">
        {row.getValue("templateID")}
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {formatDistanceToNow(new Date(row.getValue("createdAt")), {
          addSuffix: true,
        })}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {formatDistanceToNow(new Date(row.getValue("updatedAt")), {
          addSuffix: true,
        })}
      </div>
    ),
  },
];
