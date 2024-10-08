'use client'

import { Service } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  EyeIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { format } from 'date-fns'
import { serviceCalculationTypeText, serviceTypeText } from '@/utils/functions'
import EditServiceDialog from './edit-service-dialog'
import { ServiceWithGoods } from '@/utils/types'
import DeleteServiceDialog from './delete-service-dialog'
import { formatter, TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'

// components/services/columns.tsx

export const serviceColumns: ColumnDef<ServiceWithGoods>[] = [
  {
    accessorKey: 'remarks',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Keterangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'serviceType',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipe Jasa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => serviceTypeText(row.original.serviceType),
  },
  // {
  // 	accessorKey: "serviceCalculationType",
  // 	header: ({ column }) => {
  // 		return (
  // 			<Button
  // 				variant="ghost"
  // 				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  // 			>
  // 				Tambah/Kurang
  // 				<ArrowUpDown className="ml-2 h-4 w-4" />
  // 			</Button>
  // 		);
  // 	},
  // 	cell: ({ row }) =>
  // 		serviceCalculationTypeText(row.original.serviceCalculationType),
  // },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal Pengerjaan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      formatInTimeZone(row.original.date, TIMEZONE, 'dd-MM-yyyy'),
  },
  {
    accessorKey: 'buyPrice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Harga Beli
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatter.format(row.original.buyPrice || 0),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/services/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={row.original}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      )
    },
    size: 200,
  },
]
