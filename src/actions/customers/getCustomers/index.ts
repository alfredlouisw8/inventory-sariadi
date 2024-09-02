import prisma from "@/lib/prisma";

export default async function getCustomers() {
	const response = await prisma.customer.findMany();

	return response;
}
