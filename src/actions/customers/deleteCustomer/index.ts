"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { CustomerSchema } from "../schema";
import { InputType, ReturnType } from "../types";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	let result;

	const { customerId } = data;

	try {
		result = await prisma.customer.delete({
			where: {
				id: customerId,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal menghapus customer",
		};
	}

	revalidatePath(`/customers`);
	return { data: result };
};

export const deleteCustomer = createSafeAction(CustomerSchema, handler);
