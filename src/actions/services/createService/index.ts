"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { CreateService } from "./schema";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { ServiceCalculationType, ServiceType } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Unauthorized",
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
	} = data;

	try {
		const [service] = await prisma.$transaction([
			prisma.service.create({
				data: {
					serviceType: serviceType as ServiceType,
					serviceCalculationType:
						serviceCalculationType as ServiceCalculationType,
					date,
					remarks,
					buyPrice,
					sellPrice,
					customerId,
					serviceGoods: {
						create: goods.map((good) => ({
							goodId: good.goodId, // Make sure this is included in your InputType
							goodCount: good.goodCount,
							containerNumber: good.containerNumber, // Adjust based on your input
							truckNumber: good.truckNumber, // Adjust based on your input
						})),
					},
				},
			}),
			...goods.map((good) => {
				let calculationType = {};
				switch (serviceCalculationType) {
					case ServiceCalculationType.Add:
						calculationType = { increment: good.goodCount };
						break;
					case ServiceCalculationType.Substract:
						calculationType = { decrement: good.goodCount };
						break;
					default:
						break;
				}

				return prisma.good.update({
					where: { id: good.goodId },
					data: {
						currentCount: calculationType,
					},
				});
			}),
		]);

		revalidatePath(`/customers/${customerId}`);
		return { data: service };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to create service.",
		};
	}
};

export const createService = createSafeAction(CreateService, handler);
