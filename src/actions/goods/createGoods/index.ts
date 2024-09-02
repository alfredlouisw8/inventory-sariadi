"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { CreateGood } from "./schema";
import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Unauthorized",
		};
	}

	let result;

	const { name, specification, packing, currentCount, remarks, customerId } =
		data;

	try {
		result = await prisma.good.create({
			data: {
				name,
				specification,
				packing,
				currentCount,
				customerId,
				remarks,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to create goods.",
		};
	}

	revalidatePath(`/customers/${customerId}`);
	return { data: result };
};

export const createGood = createSafeAction(CreateGood, handler);
