import getGoods from '@/actions/goods/getGoods'
import getServiceDetail from '@/actions/services/getServiceDetail'
import BackButton from '@/components/back-button'
import AddServiceGoodDialog from '@/components/serviceGoods/add-service-goods-dialog'
import { serviceWithGoodsColumns } from '@/components/serviceGoods/columns'
import DeleteServiceDialog from '@/components/services/delete-service-dialog'
import EditServiceDialog from '@/components/services/edit-service-dialog'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { TIMEZONE } from '@/utils/const'
import { serviceCalculationTypeText, serviceTypeText } from '@/utils/functions'
import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { PencilIcon, Trash2 } from 'lucide-react'

export default async function ServiceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const serviceId = params.id

  const serviceDetail = await getServiceDetail(serviceId)

  if (!serviceDetail) {
    return <div>Jasa tidak ditemukan</div>
  }

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Detail Jasa</h1>
        <div className="flex items-center gap-2">
          <EditServiceDialog
            serviceData={serviceDetail}
            triggerComponent={
              <Button variant="outline" size="icon">
                <PencilIcon className=" h-4 w-4" />
              </Button>
            }
          />
          <DeleteServiceDialog
            serviceData={serviceDetail}
            triggerComponent={
              <Button variant="destructive" size="icon">
                <Trash2 className=" h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex rounded-lg shadow-sm ">
        <div className="flex flex-col gap-5 w-full">
          <div>
            <p>
              <b>Kode Jasa</b>: {serviceDetail.serviceCode}
            </p>
            <p>
              <b>Tipe Jasa</b>: {serviceTypeText(serviceDetail.serviceType)}
            </p>
            <p>
              <b>Tambah / Kurang</b>:{' '}
              {serviceCalculationTypeText(serviceDetail.serviceCalculationType)}
            </p>
            <p>
              <b>Tanggal Pengerjaan</b>:{' '}
              {formatInTimeZone(serviceDetail.date, TIMEZONE, 'dd-MM-yyyy')}
            </p>
            <p>
              <b>Keterangan</b>: {serviceDetail.remarks}
            </p>
            <p>
              <b>Harga Beli</b>: {serviceDetail.buyPrice}
            </p>
            <p>
              <b>Harga Jual</b>: {serviceDetail.sellPrice}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Barang</p>
            </div>
            <div>
              <DataTable
                columns={serviceWithGoodsColumns}
                data={serviceDetail.serviceGoods}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
