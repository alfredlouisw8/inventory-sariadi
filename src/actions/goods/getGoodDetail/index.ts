import prisma from "@/lib/prisma";

export default async function getGoodDetail(goodId: string) {
	const response = await prisma.good.findUnique({
		where: {
			id: goodId,
		},
		include: {
			serviceGoods: {
				// Include the serviceGoods relation
				include: {
					service: true, // Include the good relation to get details about each good
				},
			},
		},
	});

	return response;
}
