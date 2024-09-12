"use server";

import { serviceTypeText } from "@/utils/functions";
import { format } from "date-fns";

export async function exportServicesData(customerId: string) {
	const customer = await prisma.customer.findUnique({
		where: {
			id: customerId,
		},
	});
	const result = await prisma.serviceGood.findMany({
		where: {
			customerId,
		},
		include: {
			good: true,
			service: true,
		},
	});

	const data = result.map((item) => ({
		nama_customer: customer?.name,
		kode_jasa: item.service.serviceCode,
		tanggal_pengerjaan: format(item.service.date, "P"),
		tipe_jasa: serviceTypeText(item.service.serviceType),
		no_container: item.containerNumber,
		no_truck: item.truckNumber,
		nama_barang: item.good.name,
		spek_barang: item.good.specification,
		packing_barang: item.good.packing,
		jumlah: item.goodCount,
		keterangan: item.service.remarks,
	}));

	return data;
}
