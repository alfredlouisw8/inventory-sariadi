import prisma from "@/lib/prisma";

export default async function getServices(customerId: string) {
	const response = await prisma.service.findMany({
		where: {
			customerId,
		},
	});

	return response;
}
