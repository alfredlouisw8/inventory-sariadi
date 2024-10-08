import getInvoiceDetail from '@/actions/invoices/getInvoiceDetail'
import getServices from '@/actions/services/getServices'
import BackButton from '@/components/back-button'
import { invoiceServicesColumns } from '@/components/invoices/columns'
import DeleteInvoiceDialog from '@/components/invoices/delete-invoice-dialog'
import EditInvoiceDialog from '@/components/invoices/edit-invoice-dialog'
import { serviceColumns } from '@/components/services/columns'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { formatter, PRICE_TAX, TIMEZONE } from '@/utils/const'
import {
  calculateProfit,
  getSellPriceBeforeTax,
  getSellPriceTotal,
  serviceTypeText,
} from '@/utils/functions'
import { ServiceType } from '@prisma/client'
import { format } from 'date-fns'
import { PencilIcon, Trash2 } from 'lucide-react'
import { formatInTimeZone } from 'date-fns-tz'

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const invoiceId = params.id

  const invoiceDetail = await getInvoiceDetail(invoiceId)

  if (!invoiceDetail) {
    return <div>Invoice tidak ditemukan</div>
  }

  const buyPriceTotal = invoiceDetail.services.reduce(
    (acc, service) => acc + (service.buyPrice || 0),
    0
  )

  const sellPriceBeforeTax = getSellPriceBeforeTax(
    invoiceDetail.totalPrice || 0,
    invoiceDetail.services.map((s) => s.sellPrice || 0)
  )

  const sellPriceTotal = getSellPriceTotal(
    sellPriceBeforeTax,
    invoiceDetail.tax
  )

  const totalProfit = calculateProfit(
    buyPriceTotal,
    sellPriceBeforeTax,
    invoiceDetail.tax
  )

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Detail Invoice</h1>
        <div className="flex items-center gap-2">
          <EditInvoiceDialog
            invoiceData={invoiceDetail}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteInvoiceDialog
            invoiceData={invoiceDetail}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex flex-col rounded-lg shadow-sm gap-5">
        <div className="flex flex-col gap-5 w-full">
          <p>
            <b>Tanggal invoice</b>:{' '}
            {formatInTimeZone(
              invoiceDetail.invoiceDate,
              TIMEZONE,
              'dd-MM-yyyy'
            )}
          </p>
          <p>
            <b>Invoice ID</b>: {invoiceDetail.invoiceCode}
          </p>
          <p>
            <b>Tanggal Pelunasan</b>:{' '}
            {invoiceDetail.paymentDate
              ? formatInTimeZone(
                  invoiceDetail.paymentDate,
                  TIMEZONE,
                  'dd-MM-yyyy'
                )
              : '-'}
          </p>
          <p>
            <b>PPN</b>: {invoiceDetail.tax ? 'Ya' : 'Tidak'}
          </p>
          <p>
            <b>Harga Beli Total</b>: {formatter.format(buyPriceTotal)}
          </p>
          <p>
            <b>Harga Jual Total</b>: {formatter.format(sellPriceTotal)}
          </p>
          <p>
            <b>Profit</b>: {formatter.format(totalProfit)}
          </p>
          <p>
            <b>Keterangan</b>: {invoiceDetail.remarks}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold">Jasa</p>
          </div>
          <div>
            <DataTable
              columns={invoiceServicesColumns}
              data={invoiceDetail.services}
              filterColumn={{
                label: 'keterangan jasa',
                name: 'remarks',
              }}
              dateFilter={{
                label: 'tanggal jasa',
                name: 'date',
              }}
              selectFilter={{
                label: 'tipe jasa',
                name: 'serviceType',
                options: Object.keys(ServiceType).map((type) => ({
                  label: serviceTypeText(type),
                  value: type,
                })),
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
