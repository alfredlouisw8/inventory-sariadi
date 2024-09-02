import prisma from "@/lib/prisma";

export default async function getInvoices(customerId: string) {
	const response = await prisma.invoice.findMany({
		where: {
			customerId,
		},
	});

	return response;
}
