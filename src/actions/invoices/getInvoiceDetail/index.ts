import prisma from "@/lib/prisma";

export default async function getInvoiceDetail(invoiceId: string) {
	const response = await prisma.invoice.findUnique({
		where: {
			id: invoiceId,
		},
		include: {
			services: true,
		},
	});

	return response;
}
