import prisma from "@/lib/prisma";

export default async function getLogs() {
	const response = await prisma.log.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return response;
}
