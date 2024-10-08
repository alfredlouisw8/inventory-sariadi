'use client'

import { Log } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'

export const logsColumns: ColumnDef<Log>[] = [
  {
    accessorKey: 'details',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Detail
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tanggal
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatInTimeZone(row.original.createdAt, TIMEZONE, 'Pp'),
  },
]
