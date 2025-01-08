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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TableFilterSection from "@/components/globals/table-filter-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { useApiUrl } from "@/hooks/use-api-url";
import { useState } from "react";
import { useShareableState } from "@/hooks/use-sharable-state";
import { Button } from "@/components/ui/button";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

// stable reference for fallback data
const fallbackData: Template[] = [];

export default function TemplatesTable() {
  "use no memo";

  const { teamId } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { getShareableUrl } = useShareableState({
    configs: [
      {
        key: "sort",
        parser: (value: string): SortingState => JSON.parse(value),
        serializer: (value: SortingState): string => JSON.stringify(value),
      },
      {
        key: "search",
        parser: (value: string): string => value,
        serializer: (value: string): string => value,
      },
    ] as const,
    onParams: ({ sort, search }) => {
      if (sort) setSorting(sort);
      if (search) setGlobalFilter(search);
    },
  });

  const apiUrl = useApiUrl();

  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAM_TEMPLATES(teamId as string, apiUrl),
    queryFn: async () => {
      const res = await getTeamTemplatesAction({
        apiUrl,
        teamId: teamId as string,
      });

      if (res.type === "error") {
        throw new Error(res.message);
      }

      return res.data;
    },
    enabled: Boolean(teamId && apiUrl),
  });

  const table = useReactTable({
    data: templates ?? fallbackData,
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
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            View and manage your available templates.
          </CardDescription>
        </div>
        <DebouncedInput
          value={globalFilter}
          onChange={(v) => setGlobalFilter(v as string)}
          placeholder="Fuzzy search..."
          className="w-[320px]"
        />
      </CardHeader>
      <CardContent>
        <TableFilterSection
          globalFilter={globalFilter}
          sorting={sorting}
          table={table}
        />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <DataTableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DataTableHead
                    key={header.id}
                    column={header.column}
                    sorting={sorting.find((s) => s.id === header.id)?.desc}
                  >
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
            {templatesError ? (
              <DataTableRow>
                <TableCell colSpan={COLUMNS.length} className="h-24 text-left">
                  <Alert className="w-full text-left" variant="error">
                    <AlertTitle>Error loading templates.</AlertTitle>
                    <AlertDescription>
                      {templatesError.message}
                    </AlertDescription>
                  </Alert>
                </TableCell>
              </DataTableRow>
            ) : templatesLoading ? (
              <DataTableRow>
                <TableCell colSpan={COLUMNS.length} className="h-24 text-left">
                  <Alert className="w-full text-left" variant="contrast2">
                    <AlertTitle className="flex items-center gap-2">
                      <Loader variant="compute" />
                      Loading templates...
                    </AlertTitle>
                    <AlertDescription>This may take a moment.</AlertDescription>
                  </Alert>
                </TableCell>
              </DataTableRow>
            ) : templates && table.getRowModel()?.rows?.length ? (
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
              /* we suppress hydration warning here because the table is not hydrated until the query is enabled */
              <DataTableRow suppressHydrationWarning>
                <TableCell
                  suppressHydrationWarning
                  colSpan={COLUMNS.length}
                  className="h-24 text-left"
                >
                  <Alert
                    className="w-full text-left"
                    suppressHydrationWarning
                    variant="contrast1"
                  >
                    <AlertTitle suppressHydrationWarning>
                      No templates found.
                    </AlertTitle>
                    <AlertDescription suppressHydrationWarning>
                      Start more Templates or try different filters.
                    </AlertDescription>
                  </Alert>
                </TableCell>
              </DataTableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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
