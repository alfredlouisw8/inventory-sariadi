import getCustomerDetail from '@/actions/customers/getCustomerDetail'
import getServices from '@/actions/services/getServices'
import { DataTable } from '@/components/ui/data-table'
import getGoods from '@/actions/goods/getGoods'
import { goodColumns } from '@/components/goods/columns'
import AddGoodDialog from '@/components/goods/add-good-dialog'
import AddServiceDialog from '@/components/services/add-service-dialog'
import BackButton from '@/components/back-button'
import getInvoices from '@/actions/invoices/getInvoices'
import { invoicesColumns } from '@/components/invoices/columns'
import AddInvoiceDialog from '@/components/invoices/add-invoice-dialog'
import { serviceColumns } from '@/components/services/columns'
import { Button } from '@/components/ui/button'
import { PencilIcon, Trash2 } from 'lucide-react'
import EditCustomerDialog from '@/components/customers/edit-customer-dialog'
import DeleteCustomerDialog from '@/components/customers/delete-customer-dialog'
import { CSVLink, CSVDownload } from 'react-csv'
import ExportCSV from '@/components/export-csv'
import { exportServicesData } from '@/actions/services/exportServices'
import { exportInvoicesData } from '@/actions/invoices/exportInvoices'
import { exportGoodsData } from '@/actions/goods/exportGoods'

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const customerId = params.id

  const customerDetailData = await getCustomerDetail(customerId)

  if (!customerDetailData) {
    return <div>Customer tidak ditemukan</div>
  }

  const servicesData = customerDetailData.services
  const goodsData = customerDetailData.goods
  const invoicesData = customerDetailData.invoices

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Detail Customer</h1>
        <div className="flex items-center gap-2">
          <EditCustomerDialog
            customerData={customerDetailData}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteCustomerDialog
            customerData={customerDetailData}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex rounded-lg shadow-sm ">
        <div className="flex flex-col gap-10 w-full">
          <div>
            <p>
              <b>Nama</b>: {customerDetailData.name}
            </p>
            <p>
              <b>Perusahaan</b>: {customerDetailData.company}
            </p>
            <p>
              <b>Keterangan</b>: {customerDetailData.remarks}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Jasa</p>

              <div className="flex items-center gap-2">
                <ExportCSV
                  url={`/api/services/export?customerId=${customerId}`}
                  fileName="jasa.csv"
                />
                <AddServiceDialog customerId={customerId} />
              </div>
            </div>
            <div>
              <DataTable
                columns={serviceColumns}
                data={servicesData}
                filterColumn={{
                  label: 'kode jasa',
                  name: 'serviceCode',
                }}
                dateFilter={{
                  label: 'tanggal jasa',
                  name: 'date',
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Barang</p>
              <div className="flex items-center gap-2">
                <ExportCSV
                  url={`/api/goods/export?customerId=${customerId}`}
                  fileName="barang.csv"
                />
                <AddGoodDialog customerId={customerId} />
              </div>
            </div>
            <div>
              <DataTable
                columns={goodColumns}
                data={goodsData}
                filterColumn={{ label: 'nama barang', name: 'name' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Invoice</p>

              <div className="flex items-center gap-2">
                <ExportCSV
                  url={`/api/invoices/export?customerId=${customerId}`}
                  fileName="invoice.csv"
                />
                <AddInvoiceDialog customerId={customerId} />
              </div>
            </div>
            <div>
              <DataTable
                columns={invoicesColumns}
                data={invoicesData}
                filterColumn={{ label: 'nomor invoice', name: 'invoiceCode' }}
                dateFilter={{
                  label: 'tanggal pembayaran',
                  name: 'paymentDate',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
