"use server";

export async function exportGoodsData(customerId: string) {
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

	const data = result.map((item) => ({
		nama_customer: customer?.name,
		nama_barang: item.name,
		spek_barang: item.specification,
		packing_barang: item.packing,
		total_jumlah: item.currentCount,
		keterangan: item.remarks,
	}));

	return data;
}
