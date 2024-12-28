"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

// temporary type for mock data
interface Sandbox {
  alias: string;
  clientID: string;
  cpuCount: number;
  endAt: string;
  memoryMB: number;
  metadata: Record<string, any>;
  sandboxID: string;
  startedAt: string;
  templateID: string;
}

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  if (!value || typeof value !== "string") return true;

  const searchValue = value.toLowerCase();
  const cellValue = String(row.getValue(columnId)).toLowerCase();

  addMeta({
    itemRank: rankItem(cellValue, searchValue),
  });

  return cellValue.includes(searchValue);
};

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function SandboxesTable() {
  const [data] = useState<Sandbox[]>([
    {
      alias: "sandbox-1",
      clientID: "client-1",
      cpuCount: 1,
      endAt: "2024-01-01",
      memoryMB: 1024,
      metadata: {},
      sandboxID: "sandbox-1",
      startedAt: "2024-01-01",
      templateID: "template-1",
    },
    {
      alias: "sandbox-2",
      clientID: "client-2",
      cpuCount: 2,
      endAt: "2024-01-02",
      memoryMB: 2048,
      metadata: {},
      sandboxID: "sandbox-2",
      startedAt: "2024-01-02",
      templateID: "template-2",
    },
  ]);

  const columns = useMemo<ColumnDef<Sandbox>[]>(
    () => [
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
    ],
    [],
  );

  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableGlobalFilter: true,
  });

  return (
    <>
      <div className="mb-4">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No sandboxes found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
