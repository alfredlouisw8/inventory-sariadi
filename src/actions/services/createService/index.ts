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

		// Create the service and related goods
		const servicePromise = prisma.service.create({
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
				invoiceId: null,
				serviceGoods: {
					create: goods.map(
						({ goodId, goodCount, containerNumber, truckNumber }) => ({
							goodId,
							goodCount,
							containerNumber,
							truckNumber,
						})
					),
				},
			},
		});

		// Create an array of Prisma promises for goods updates
		const goodsUpdates = goods.reduce((acc, { goodCount, goodId }) => {
			let calculationType = {};

			// Skip calculation if serviceCalculationType is Equal
			if (serviceCalculationType === ServiceCalculationType.Equal) {
				return acc; // Return accumulator without adding anything
			}

			// Handle Add and Subtract calculation types
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

			// Push the Prisma promise for updating goods to the accumulator
			acc.push(
				prisma.good.update({
					where: { id: goodId },
					data: { currentCount: calculationType },
				})
			);

			return acc;
		}, [] as PrismaPromise<any>[]);

		// Execute the transaction with the service creation and goods updates
		const [service] = await prisma.$transaction([
			servicePromise,
			...goodsUpdates,
		]);

		// Revalidate the cache after successful operations
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
