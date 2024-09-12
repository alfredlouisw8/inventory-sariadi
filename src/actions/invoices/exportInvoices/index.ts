"use server";

import { serviceTypeText } from "@/utils/functions";
import { format } from "date-fns";

export async function exportInvoicesData(customerId: string) {
	const customer = await prisma.customer.findUnique({
		where: {
			id: customerId,
		},
	});
	const result = await prisma.service.findMany({
		where: {
			customerId,
			invoiceId: {
				not: null,
			},
		},
		include: {
			invoice: true,
		},
	});

	const data = result.map((item) => ({
		nama_customer: customer?.name,
		kode_invoice: item.invoice?.invoiceCode,
		tanggal_pelunasan: item.invoice?.paymentDate
			? format(item.invoice?.paymentDate, "P")
			: "Belum dibayar",
		kode_jasa: item.serviceCode,
		tipe_jasa: serviceTypeText(item.serviceType),
		tanggal_pengerjaan: format(item.date, "P"),
		harga_beli: item.buyPrice,
		harga_jual: item.sellPrice,
		ppn: item.invoice?.tax ? "Ya" : "Tidak",
		keterangan: item.invoice?.remarks,
	}));

	return data;
}
