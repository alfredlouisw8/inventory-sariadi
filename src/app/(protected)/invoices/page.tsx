import getInvoices from '@/actions/invoices/getInvoices'
import { invoiceColumns } from '@/components/invoices/columns'
import ExportInvoiceXlsx from '@/components/invoices/export-invoice'
import { DataTable } from '@/components/ui/data-table'

export default async function CustomersPage() {
  const data = await getInvoices()
  const filterColumn = {
    label: 'kode invoice',
    name: 'invoiceCode',
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Invoices</h1>
        <ExportInvoiceXlsx customerId="" />
      </div>
      <div className="flex rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1">
        <DataTable
          columns={invoiceColumns}
          data={data}
          filterColumn={filterColumn}
          dateFilter={{ label: 'tanggal invoice', name: 'invoiceDate' }}
        />
      </div>
    </>
  )
}
