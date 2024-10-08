"use server";

import prisma from "@/lib/prisma";

export async function exportGoodsData(customerId: string) {
	let data: any[] = [];

	try {
		const customer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
		});
		const result = await prisma.good.findMany({
			where: {
				customerId,
			},
		});

		data = result.map((item) => ({
			nama_customer: customer?.name,
			nama_barang: item.name,
			spek_barang: item.specification,
			packing_barang: item.packing,
			total_jumlah: item.currentCount,
			keterangan: item.remarks,
		}));
	} catch (error) {
		console.error(error);
	}

	return data;
}
