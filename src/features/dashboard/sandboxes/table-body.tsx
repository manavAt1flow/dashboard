import { Alert, AlertDescription, AlertTitle } from '@/ui/primitives/alert'
import { DataTableBody, DataTableCell, DataTableRow } from '@/ui/data-table'
import { AssemblyLoader } from '@/ui/loader'
import { Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { SandboxWithMetrics } from './table-config'
import { useMemo } from 'react'
import Empty from '@/ui/empty'
import { Button } from '@/ui/primitives/button'
import { useTemplateTableStore } from '../templates/stores/table-store'
import { useSandboxTableStore } from './stores/table-store'
import { ExternalLink, FilterX, X } from 'lucide-react'
import ExternalIcon from '@/ui/external-icon'

interface TableBodyProps {
  sandboxes: SandboxWithMetrics[] | undefined
  table: Table<SandboxWithMetrics>
  visualRowsCount: number
}

export function TableBody({
  sandboxes,
  table,
  visualRowsCount,
}: TableBodyProps) {
  'use no memo'

  const resetFilters = useSandboxTableStore((state) => state.resetFilters)

  const centerRows = table.getCenterRows()

  const visualRows = useMemo(() => {
    return centerRows.slice(0, visualRowsCount)
  }, [centerRows, visualRowsCount])

  const isEmpty = sandboxes && visualRows?.length === 0

  const hasFilter =
    Object.values(table.getState().columnFilters).some(
      (filter) => filter.value !== undefined
    ) || table.getState().globalFilter !== ''

  if (isEmpty) {
    if (hasFilter) {
      return (
        <Empty
          title="No Results Found"
          description="No sandboxes match your current filters"
          message={
            <Button variant="default" onClick={resetFilters}>
              Reset Filters <X className="size-4 text-accent" />
            </Button>
          }
          className="h-[70%] max-md:w-screen"
        />
      )
    }

    return (
      <Empty
        title="No Sandboxes Yet"
        description="Running Sandboxes can be observed here"
        message={
          <Button variant="default" asChild>
            <a href="/docs/quickstart" target="_blank" rel="noopener">
              Create a Sandbox
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        }
        className="h-[70%] max-md:w-screen"
      />
    )
  }

  return (
    <DataTableBody>
      {visualRows.map((row) => (
        <DataTableRow
          key={row.id}
          isSelected={row.getIsSelected()}
          className="cursor-pointer"
        >
          {row.getVisibleCells().map((cell) => (
            <DataTableCell key={cell.id} cell={cell}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </DataTableCell>
          ))}
        </DataTableRow>
      ))}
    </DataTableBody>
  )
}
