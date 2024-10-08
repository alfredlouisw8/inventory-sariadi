'use client'

import { Good, Invoice, Service } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  EyeIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'

import Link from 'next/link'
import { serviceTypeText } from '@/utils/functions'
import { format } from 'date-fns'
import EditInvoiceDialog from './edit-invoice-dialog'
import { InvoiceWithServices } from '@/utils/types'
import DeleteInvoiceDialog from './delete-invoice-dialog'
import { formatter, TIMEZONE } from '@/utils/const'
import { formatInTimeZone } from 'date-fns-tz'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'customer.name',
    id: 'customerName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal invoice
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.invoiceDate
        ? formatInTimeZone(
            new Date(row.original.invoiceDate),
            TIMEZONE,
            'dd-MM-yyyy'
          )
        : '-',
  },
  {
    accessorKey: 'invoiceCode',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'paymentDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal pelunasan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.paymentDate
        ? formatInTimeZone(
            new Date(row.original.paymentDate),
            TIMEZONE,
            'dd-MM-yyyy'
          )
        : '-',
  },
  {
    accessorKey: 'tax',
    header: ({ column }) => {
      return <Button variant="ghost">PPN</Button>
    },
    cell: ({ row }) => (row.original.tax ? 'Ya' : 'Tidak'),
  },
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
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/invoices/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
        </div>
      )
    },
    size: 200,
  },
]

export const invoicesWithServicesColumns: ColumnDef<InvoiceWithServices>[] = [
  {
    accessorKey: 'invoiceDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal invoice
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.invoiceDate
        ? formatInTimeZone(
            new Date(row.original.invoiceDate),
            TIMEZONE,
            'dd-MM-yyyy'
          )
        : '-',
  },
  {
    accessorKey: 'invoiceCode',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Invoice ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'paymentDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal pembayaran
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.paymentDate
        ? formatInTimeZone(
            new Date(row.original.paymentDate),
            TIMEZONE,
            'dd-MM-yyyy'
          )
        : '-',
  },
  {
    accessorKey: 'tax',
    header: ({ column }) => {
      return <Button variant="ghost">PPN</Button>
    },
    cell: ({ row }) => (row.original.tax ? 'Ya' : 'Tidak'),
  },
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
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 justify-end">
          <Link
            href={`/invoices/${row.original.id}`}
            className={buttonVariants({ size: 'icon' })}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <EditInvoiceDialog
            invoiceData={row.original}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteInvoiceDialog
            invoiceData={row.original}
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

export const invoiceServicesColumns: ColumnDef<Service>[] = [
  {
    accessorKey: 'serviceCode',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kode Jasa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
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
    accessorKey: 'sellPrice',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Harga Jual
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatter.format(row.original.sellPrice || 0),
  },
  {
    accessorKey: 'profit',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Profit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.original.sellPrice === 0
        ? 0
        : formatter.format(row.original.profit || 0),
  },
]
