import prisma from "@/lib/prisma";

export default async function getGoods(customerId: string) {
	const response = await prisma.good.findMany({
		where: {
			customerId,
		},
	});

	return response;
}
