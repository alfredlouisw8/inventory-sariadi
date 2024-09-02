import prisma from "@/lib/prisma";

export default async function getServiceDetail(serviceId: string) {
	const response = await prisma.service.findUnique({
		where: {
			id: serviceId,
		},
		include: {
			serviceGoods: {
				// Include the serviceGoods relation
				include: {
					good: true, // Include the good relation to get details about each good
				},
			},
		},
	});

	return response;
}
