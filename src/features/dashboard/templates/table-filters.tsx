'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/primitives/dropdown-menu'
import { Button } from '@/ui/primitives/button'
import { FilterIcon, ListFilter } from 'lucide-react'
import { TableFilterButton } from '@/ui/table-filter-button'
import { Slider } from '@/ui/primitives/slider'
import { Label } from '@/ui/primitives/label'
import { Separator } from '@/ui/primitives/separator'
import { useDebounceValue } from 'usehooks-ts'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTemplateTableStore } from './stores/table-store'

// Components
const ResourcesFilter = () => {
  const { cpuCount, setCpuCount, memoryMB, setMemoryMB } =
    useTemplateTableStore()

  const [localCpuCount, setLocalCpuCount] = React.useState(cpuCount || 0)
  const [localMemoryMB, setLocalMemoryMB] = React.useState(memoryMB || 0)

  const [debouncedCpuCount] = useDebounceValue(localCpuCount, 300)
  const [debouncedMemoryMB] = useDebounceValue(localMemoryMB, 300)

  React.useEffect(() => {
    setCpuCount(debouncedCpuCount || undefined)
  }, [debouncedCpuCount, setCpuCount])

  React.useEffect(() => {
    setMemoryMB(debouncedMemoryMB || undefined)
  }, [debouncedMemoryMB, setMemoryMB])

  return (
    <div className="w-80 p-4">
      <div className="grid gap-4">
        {/* CPU Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>CPU Cores</Label>
            <span className="text-xs text-accent">
              {localCpuCount === 0 ? 'Off' : `${localCpuCount} cores`}
            </span>
          </div>
          <Slider
            value={[localCpuCount]}
            onValueChange={([value]) => setLocalCpuCount(value)}
            max={8}
            step={1}
            className="[&_.slider-range]:bg-transparent [&_.slider-thumb]:border-fg-500 [&_.slider-thumb]:bg-bg [&_.slider-track]:bg-fg-100"
          />
        </div>
        <Separator />
        {/* Memory Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Memory</Label>
            <span className="text-xs text-accent">
              {localMemoryMB === 0 ? 'Off' : `${localMemoryMB} MB`}
            </span>
          </div>
          <Slider
            value={[localMemoryMB]}
            onValueChange={([value]) => setLocalMemoryMB(value)}
            max={8192}
            step={512}
            className="[&_.slider-range]:bg-transparent [&_.slider-thumb]:border-fg-500 [&_.slider-thumb]:bg-bg [&_.slider-track]:bg-fg-100"
          />
        </div>
      </div>
    </div>
  )
}

// Main component

export interface TemplatesTableFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TemplatesTableFilters = React.forwardRef<
  HTMLDivElement,
  TemplatesTableFiltersProps
>(({ className, ...props }, ref) => {
  const {
    globalFilter,
    cpuCount,
    memoryMB,
    isPublic,
    createdAfter,
    createdBefore,
    setGlobalFilter,
    setCpuCount,
    setMemoryMB,
    setIsPublic,
    setCreatedAfter,
    setCreatedBefore,
  } = useTemplateTableStore()

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs normal-case">
            <ListFilter className="size-4 text-fg-500" /> Filters{' '}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Resources</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <ResourcesFilter />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Visibility</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className={isPublic === true ? 'text-accent' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsPublic(isPublic === true ? undefined : true)
                    }}
                  >
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={isPublic === false ? 'text-accent' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      setIsPublic(isPublic === false ? undefined : false)
                    }}
                  >
                    Private
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Pills */}
      {globalFilter && (
        <TableFilterButton
          label="Search"
          value={globalFilter}
          onClick={() => setGlobalFilter('')}
        />
      )}
      {cpuCount && (
        <TableFilterButton
          label="CPU"
          value={`${cpuCount} cores`}
          onClick={() => setCpuCount(undefined)}
        />
      )}
      {memoryMB && (
        <TableFilterButton
          label="Memory"
          value={`${memoryMB} MB`}
          onClick={() => setMemoryMB(undefined)}
        />
      )}
      {isPublic !== undefined && (
        <TableFilterButton
          label="Visibility"
          value={isPublic ? 'Public' : 'Private'}
          onClick={() => setIsPublic(undefined)}
        />
      )}
      {(createdAfter || createdBefore) && (
        <TableFilterButton
          label="Date Range"
          value="Active"
          onClick={() => {
            setCreatedAfter(undefined)
            setCreatedBefore(undefined)
          }}
        />
      )}
    </div>
  )
})

TemplatesTableFilters.displayName = 'TemplatesTableFilters'

export default TemplatesTableFilters
