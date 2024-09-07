"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { ServiceCalculationType, ServiceType } from "@prisma/client";
import { InputType, ReturnType } from "../types";
import { ServiceSchema } from "../schema";
import { generateServiceCode } from "../functions";

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
	} = data;

	try {
		const customer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
		});

		const serviceCode = await generateServiceCode(customer?.name as string);

		const [service] = await prisma.$transaction([
			prisma.service.create({
				data: {
					serviceType: serviceType as ServiceType,
					serviceCalculationType:
						serviceCalculationType as ServiceCalculationType,
					date,
					serviceCode,
					remarks,
					buyPrice,
					sellPrice,
					customerId,
					serviceGoods: {
						create: goods.map(
							({ goodId, goodCount, containerNumber, truckNumber }) => ({
								goodId, // Make sure this is included in your InputType
								goodCount,
								containerNumber, // Adjust based on your input
								truckNumber, // Adjust based on your input
							})
						),
					},
				},
			}),
			...goods.map(({ goodCount, goodId }) => {
				let calculationType = {};
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

				return prisma.good.update({
					where: { id: goodId },
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
			error: error.message || "Gagal menambah jasa",
		};
	}
};

export const createService = createSafeAction(ServiceSchema, handler);
