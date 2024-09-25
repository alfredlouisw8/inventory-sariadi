'use server'

import { serviceTypeText } from '@/utils/functions'
import { format } from 'date-fns'

import prisma from '@/lib/prisma'

export async function exportServicesData(customerId: string) {
  let data: any[] = []

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    })
    const result = await prisma.serviceGood.findMany({
      where: {
        customerId,
      },
      include: {
        good: true,
        service: true,
      },
    })

    data = result.map((item) => ({
      nama_customer: customer?.name,
      kode_jasa: item.service.serviceCode,
      tanggal_pengerjaan: format(item.service.date, 'dd-MM-yyyy'),
      tipe_jasa: serviceTypeText(item.service.serviceType),
      no_container: item.containerNumber,
      no_truck: item.truckNumber,
      nama_barang: item.good.name,
      spek_barang: item.good.specification,
      packing_barang: item.good.packing,
      jumlah: item.goodCount,
      keterangan: item.service.remarks,
    }))
  } catch (error: any) {
    console.error(error)
  }

  return data
}
