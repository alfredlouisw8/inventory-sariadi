import prisma from "@/lib/prisma";

export default async function getCustomerDetail(customerId: string) {
	const response = await prisma.customer.findUnique({
		where: {
			id: customerId,
		},
		include: {
			services: {
				include: {
					serviceGoods: true,
				},
			},
			goods: true,
			invoices: {
				include: {
					services: true,
				},
			},
		},
	});

	return response;
}
