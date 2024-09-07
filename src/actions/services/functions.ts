import {
	ServiceCalculationType,
	PrismaPromise,
	ServiceGood,
} from "@prisma/client";
import prisma from "@/lib/prisma";

// Function to revert inventory changes
export const revertInventoryChanges = (
	serviceCalculationType: ServiceCalculationType,
	serviceGoods: ServiceGood[]
): PrismaPromise<any>[] => {
	const transactions: PrismaPromise<any>[] = [];

	serviceGoods.forEach(({ goodId, goodCount }) => {
		let revertCalculationType = {};

		switch (serviceCalculationType) {
			case ServiceCalculationType.Add:
				revertCalculationType = { decrement: goodCount };
				break;
			case ServiceCalculationType.Substract:
				revertCalculationType = { increment: goodCount };
				break;
			default:
				break;
		}

		// Add revert operation to the transactions
		transactions.push(
			prisma.good.update({
				where: { id: goodId },
				data: {
					currentCount: revertCalculationType,
				},
			})
		);
	});

	return transactions;
};

export async function generateServiceCode(name: string): Promise<string> {
	// Get the prefix from the first word or first 5 characters of the name
	const prefix = name.split(" ")[0].slice(0, 5).toUpperCase();

	// Find the latest service code that starts with the same prefix
	const lastService = await prisma.service.findFirst({
		where: {
			serviceCode: {
				startsWith: prefix,
			},
		},
		orderBy: {
			serviceCode: "desc",
		},
	});

	let nextCodeNumber = 1; // Default if no previous code exists
	if (lastService) {
		// Extract the number part from the service code
		const lastCodeNumber = parseInt(
			lastService.serviceCode.replace(prefix, ""),
			10
		);
		nextCodeNumber = lastCodeNumber + 1;
	}

	// Generate the new service code
	return `${prefix}${String(nextCodeNumber).padStart(3, "0")}`;
}
