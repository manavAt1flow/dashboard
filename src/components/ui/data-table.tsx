import * as React from "react";
import { TableHead, TableCell, TableRow } from "./table";
import { cn } from "@/lib/utils";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLTableCellElement> {
  column: Column<TData, TValue>;
}

function DataTableHead<TData, TValue>({
  column,
  children,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <TableHead
      className={cn(
        "relative py-2.5 text-center",
        {
          "cursor-pointer hover:bg-bg-100/80": column.getCanSort(),
        },
        className,
      )}
      onClick={column.getCanSort() ? () => column.toggleSorting() : undefined}
      {...props}
    >
      {column.getCanSort() ? (
        <div
          onClick={() => column.toggleSorting()}
          className="flex h-full w-full items-center"
        >
          <span>{children}</span>
          <span className="ml-2">
            {column.getIsSorted() === "desc" ? "↓" : "↑"}
          </span>
        </div>
      ) : (
        children
      )}
    </TableHead>
  );
}

interface DataTableCellProps<TData, TValue>
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  cell: TValue;
}

function DataTableCell<TData, TValue>({
  cell,
  className,
  ...props
}: DataTableCellProps<TData, TValue>) {
  return (
    <TableCell className={cn("py-2 text-center text-xs", className)} {...props}>
      {cell as React.ReactNode}
    </TableCell>
  );
}

interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

function DataTableRow({
  children,
  className,
  isSelected,
  ...props
}: DataTableRowProps) {
  return (
    <TableRow
      className={cn(
        "transition-colors duration-0 hover:bg-bg-100/80",
        {
          "bg-bg-100": isSelected,
        },
        className,
      )}
      {...props}
    >
      {children}
    </TableRow>
  );
}

export { DataTableHead, DataTableCell, DataTableRow };
