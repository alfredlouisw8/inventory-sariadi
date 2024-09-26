'use client'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Button } from '../ui/button'
import { ExportInvoiceData } from '@/utils/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { useState } from 'react'
import { DatePickerWithRange } from '../ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

type Props = {
  customerId: string
}

export default function ExportInvoiceXlsx({ customerId }: Props) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  async function exportInvoicesToExcel(customerId: string) {
    try {
      // Fetch invoice data from the API
      const response = await fetch(
        `/api/invoices/export?customerId=${customerId}&fromDate=${format(
          dateRange?.from || new Date(),
          'yyy-MM-dd'
        )}&toDate=${format(dateRange?.to || new Date(), 'yyyy-MM-dd')}`
      )
      console.log('response', response)

      if (!response.ok) throw new Error('Failed to fetch invoice data')

      let invoicesData: ExportInvoiceData

      const { data } = await response.json()
      if (!data.length) throw new Error('No data available for export')

      invoicesData = data

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Invoices')

      // Define and style the header row
      const headerRow = worksheet.addRow([
        'Nama Customer',
        'Kode Jasa',
        'Tipe Jasa',
        'Keterangan Jasa',
        'Harga Beli',
        'Harga Beli Total',
        'Tanggal Pengerjaan',
        'Tanggal Invoice',
        'Harga Jual',
        'Harga Jual Sebelum Pajak',
        'PPN',
        'Harga Jual Total',
        'Profit',
        'Tanggal Pelunasan',
        'Keterangan',
      ])

      // Apply styles to the header row
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }, // Yellow background
        }
        cell.font = { bold: true }
        cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      })

      // Set row height for the header (optional, you can remove this if you want it to be the same as other rows)
      headerRow.height = 20 // Set header row height

      let currentRow = 2 // Start from the second row (first row is header)

      invoicesData.forEach((customerData) => {
        const { customerName, invoices } = customerData

        invoices.forEach((invoice) => {
          const numServices = invoice.services.length

          // Add the first row for each invoice
          worksheet.addRow([customerName, invoice.invoiceCode])

          // Add the service-specific rows (starting from currentRow + 1)
          invoice.services.forEach((service, index) => {
            const row = worksheet.addRow([
              null, // Skip nama_customer (since it's merged)
              service.serviceCode, // B3, B4 for services
              service.serviceType,
              service.remarks,
              service.buyPrice,
              invoice.buyPriceTotal, // E3:E4 merged for buyPriceTotal
              service.date,
              invoice.invoiceDate,
              service.sellPrice,
              invoice.sellPriceBeforeTax, // Sell price before tax (merged)
              invoice.tax, // PPN (merged)
              invoice.sellPriceTotal, // Sell price total (merged)
              invoice.totalProfit, // Profit (merged)
              service.date,
              invoice.remarks, // Remarks (merged)
            ])

            // Apply styles to each row cell
            row.eachCell((cell) => {
              cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              }
            })

            // Set a minimum height for each row to prevent it from looking cramped
            worksheet.getRow(currentRow).height = 18 // Adjust this value as needed
          })

          // Merge the necessary cells for customer and invoice **after** all services are added
          worksheet.mergeCells(currentRow, 1, currentRow + numServices, 1) // Merge nama_customer (A2:A4)
          worksheet.mergeCells(currentRow, 2, currentRow, 15) // Merge kode_invoice (B2:M2)

          // Apply styles to merged cells for `nama_customer` and `kode_invoice`
          const customerCell = worksheet.getCell(`A${currentRow}`)
          const invoiceCell = worksheet.getCell(`B${currentRow}`)

          // Styling merged customer name and invoice code
          ;[customerCell, invoiceCell].forEach((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' } // Center text
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            }
          })

          // Merge invoice-level details across service rows
          worksheet.mergeCells(currentRow + 1, 6, currentRow + numServices, 6) // Merge harga_beli_total
          worksheet.mergeCells(currentRow + 1, 8, currentRow + numServices, 8) // Merge invoiceDate
          worksheet.mergeCells(currentRow + 1, 10, currentRow + numServices, 10) // Merge sellPriceBeforeTax
          worksheet.mergeCells(currentRow + 1, 11, currentRow + numServices, 11) // Merge tax
          worksheet.mergeCells(currentRow + 1, 12, currentRow + numServices, 12) // Merge sellPriceTotal
          worksheet.mergeCells(currentRow + 1, 13, currentRow + numServices, 13) // Merge profit
          worksheet.mergeCells(currentRow + 1, 14, currentRow + numServices, 14) // Merge paymentDate
          worksheet.mergeCells(currentRow + 1, 15, currentRow + numServices, 15) // Merge remarks (keterangan)

          // Add space after each invoice
          worksheet.addRow([])
          worksheet.mergeCells(
            currentRow + numServices + 1,
            1,
            currentRow + numServices + 1,
            15
          )

          // Update currentRow to reflect the next set of rows
          currentRow = currentRow + numServices + 2
        })
      })

      // Adjust column widths based on content length
      worksheet.columns.forEach((column, index) => {
        let maxLength = 0
        if (column) {
          //@ts-ignore
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : ''
            if (cellValue.length > maxLength) {
              maxLength = cellValue.length
            }
          })
          column.width = maxLength + 2 // Add some padding to fit content
        }
      })

      // Set a minimum row height for all rows to prevent them from looking cramped
      worksheet.eachRow((row) => {
        if (!row.height || row.height < 30) {
          row.height = 30 // Set a minimum height
        }
      })

      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, `Invoices.xlsx`)
    } catch (error) {
      console.error('Error exporting invoices to Excel:', error)
      alert('Failed to export invoices.')
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Export</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Invoice</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <DatePickerWithRange
              className="max-w-sm"
              label="tanggal"
              onChange={setDateRange}
            />
          </div>

          <DialogFooter>
            <Button onClick={() => exportInvoicesToExcel(customerId)}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
