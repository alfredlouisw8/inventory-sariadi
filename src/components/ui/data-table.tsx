'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel, // Add pagination row model
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import React, { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '../ui/checkbox'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from './date-range-picker'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select' // Add select component from your UI library
import { serviceTypeText } from '@/utils/functions'

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: {
    label: string
    name: string
  } | null
  dateFilter?: {
    label: string
    name: string
  } | null // New prop for date range filtering
  selectFilter?: {
    label: string
    name: string
    options: { label: string; value: string }[] // List of options for the select filter
  } | null // Add select filter prop
  showRowSelection?: boolean
  rowSelection?: string[]
  setRowSelection?: (
    value: string[] | ((prevSelected: string[]) => string[])
  ) => void
}

export function DataTable<
  TData extends { id: string; [key: string]: any },
  TValue
>({
  columns,
  data,
  filterColumn,
  dateFilter = null,
  selectFilter = null, // New prop for select filter
  showRowSelection = false,
  rowSelection = [],
  setRowSelection = () => {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectValue, setSelectValue] = useState<string | undefined>() // Add select filter state
  const [pageIndex, setPageIndex] = useState(0) // Add pagination state
  const [pageSize, setPageSize] = useState(10) // Number of rows per page

  // Helper function to get nested value
  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // Memoize filtered data to avoid recalculating on every render
  const filteredData = useMemo(() => {
    let result = data

    // Apply date filter if selected
    if (dateRange && dateFilter) {
      const { from, to } = dateRange
      if (from && to) {
        result = result.filter((row) => {
          const rowDate = new Date(getNestedValue(row, dateFilter.name)) // Use the helper to access nested dates
          return rowDate >= from && rowDate <= to // Check if date falls within the selected range
        })
      }
    }

    // Apply select filter if selected
    if (selectValue && selectFilter) {
      result = result.filter((row) => row[selectFilter.name] === selectValue)
    }

    return result
  }, [data, dateRange, dateFilter, selectValue, selectFilter])

  const table = useReactTable({
    data: filteredData, // Use filtered data
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({ pageIndex, pageSize })
          : updater
      setPageIndex(newPagination.pageIndex)
      setPageSize(newPagination.pageSize)
    },
  })

  const handleSelectionChange = (serviceId: string, isSelected: boolean) => {
    setRowSelection((prevSelected: string[]) => {
      if (isSelected) {
        return [...prevSelected, serviceId]
      } else {
        return prevSelected.filter((id) => id !== serviceId)
      }
    })
  }

  const handleDateFilter = (range: DateRange | undefined) => {
    setDateRange(range) // Set the selected date range
  }

  return (
    <div className="w-full">
      {(filterColumn || dateFilter || selectFilter) && (
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 w-full">
            {filterColumn && (
              <Input
                placeholder={`Cari ${filterColumn.label}`}
                value={
                  (table
                    .getColumn(filterColumn.name)
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn.name)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            )}
            {selectFilter && (
              <Select
                value={selectValue}
                onValueChange={(value) => setSelectValue(value)}
              >
                <SelectTrigger className="max-w-sm">
                  <span>
                    {selectValue
                      ? serviceTypeText(selectValue)
                      : `Pilih ${selectFilter.label}`}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {selectFilter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {dateFilter && (
            <div className="flex items-center gap-2">
              <DatePickerWithRange
                className="max-w-sm"
                label={dateFilter.label}
                onChange={handleDateFilter}
              />
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {showRowSelection && (
                  <TableHead>
                    <Checkbox
                      className="mx-4"
                      checked={rowSelection.length === data.length}
                      onCheckedChange={(isChecked) =>
                        setRowSelection(
                          isChecked ? data.map((item) => item.id) : []
                        )
                      }
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {showRowSelection && (
                    <TableCell>
                      <Checkbox
                        checked={rowSelection.includes(row.original.id)}
                        onCheckedChange={(isChecked) =>
                          handleSelectionChange(
                            row.original.id,
                            isChecked as boolean
                          )
                        }
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getCanPreviousPage() || table.getCanNextPage() ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
