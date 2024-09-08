"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import {
	PrismaPromise,
	ServiceCalculationType,
	ServiceType,
} from "@prisma/client";
import { InputType, ReturnType } from "../types";
import { ServiceSchema } from "../schema";
import { revertInventoryChanges } from "../functions";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	const {
		serviceType,
		serviceCalculationType,
		date,
		buyPrice,
		sellPrice,
		remarks,
		customerId,
		goods,
		serviceId,
	} = data;

	try {
		// 1. Fetch the current service data including the serviceGoods and calculation types
		const previousService = await prisma.service.findUnique({
			where: { id: serviceId },
			include: { serviceGoods: true },
		});

		if (!previousService) {
			return { error: "Service not found" };
		}

		const transactions: PrismaPromise<any>[] = [];

		// 2. Revert the previous calculation
		transactions.push(
			...revertInventoryChanges(
				previousService.serviceCalculationType,
				previousService.serviceGoods
			)
		);

		// 3. Update the service with new data and upsert the related serviceGoods
		transactions.push(
			prisma.service.update({
				where: { id: serviceId },
				data: {
					serviceType: serviceType as ServiceType,
					serviceCalculationType:
						serviceCalculationType as ServiceCalculationType,
					date,
					remarks,
					buyPrice,
					sellPrice,
					serviceGoods: {
						upsert: goods.map(
							({ goodId, goodCount, containerNumber, truckNumber }) => ({
								where: {
									goodId_serviceId: {
										goodId,
										serviceId,
									},
								},
								update: {
									goodCount,
									containerNumber,
									truckNumber,
								},
								create: {
									goodId,
									goodCount,
									containerNumber,
									truckNumber,
								},
							})
						),
					},
				},
			})
		);

		// 4. Apply the new calculation to the goods, skipping if the type is `Equal`
		const goodsUpdates = goods.reduce((acc, { goodCount, goodId }) => {
			let calculationType = {};

			// Skip calculation if serviceCalculationType is Equal
			if (serviceCalculationType === ServiceCalculationType.Equal) {
				return acc;
			}

			switch (serviceCalculationType) {
				case ServiceCalculationType.Add:
					calculationType = { increment: goodCount };
					break;
				case ServiceCalculationType.Substract:
					calculationType = { decrement: goodCount };
					break;
				default:
					break;
			}

			acc.push(
				prisma.good.update({
					where: { id: goodId },
					data: { currentCount: calculationType },
				})
			);

			return acc;
		}, [] as PrismaPromise<any>[]);

		// 5. Combine all transactions (service update + goods updates)
		const allTransactions = [...transactions, ...goodsUpdates];

		// Run all transactions in a batch
		const [service] = await prisma.$transaction(allTransactions);

		// Revalidate the path after update
		revalidatePath(`/customers/${customerId}`);
		return { data: service };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal merubah jasa",
		};
	}
};

export const updateService = createSafeAction(ServiceSchema, handler);
