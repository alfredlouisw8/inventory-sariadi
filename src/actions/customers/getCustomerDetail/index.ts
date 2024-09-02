import prisma from "@/lib/prisma";

export default async function getCustomerDetail(customerId: string) {
	const response = await prisma.customer.findUnique({
		where: {
			id: customerId,
		},
		include: {
			services: true,
			goods: true,
			invoices: true,
		},
	});

	return response;
}
