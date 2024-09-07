"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { GoodSchema } from "../schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	let result;

	const {
		name,
		specification,
		packing,
		currentCount,
		remarks,
		goodId,
		customerId,
	} = data;

	try {
		result = await prisma.good.update({
			where: {
				id: goodId,
			},
			data: {
				name,
				specification,
				packing,
				currentCount,
				remarks,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal merubah jasa",
		};
	}

	revalidatePath(`/customers/${customerId}`);
	return { data: result };
};

export const updateGood = createSafeAction(GoodSchema, handler);
