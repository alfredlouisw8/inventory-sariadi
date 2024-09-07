"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { CreateServiceGood } from "./schema";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { ServiceCalculationType } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	const {
		serviceId,
		goodId,
		goodCount,
		containerNumber,
		truckNumber,
		serviceCalculationType,
	} = data;

	let result;

	try {
		const [serviceGood] = await prisma.$transaction([
			prisma.serviceGood.create({
				data: {
					serviceId,
					goodId, // Make sure this is included in your InputType
					goodCount,
					containerNumber, // Adjust based on your input
					truckNumber, // Adjust based on your input
				},
			}),

			prisma.good.update({
				where: { id: goodId }, // Make sure goodId corresponds to the correct Good
				data: {
					currentCount:
						serviceCalculationType === ServiceCalculationType.Add
							? { increment: goodCount }
							: { decrement: goodCount },
				},
			}),
		]);

		revalidatePath(`/service/${serviceId}`);
		return { data: serviceGood };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to create service.",
		};
	}
};

export const createServiceGood = createSafeAction(CreateServiceGood, handler);
