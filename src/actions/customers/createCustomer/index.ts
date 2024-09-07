"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "../types";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { CustomerSchema } from "../schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	let result;

	const { name, company, remarks } = data;

	try {
		result = await prisma.customer.create({
			data: {
				name,
				company,
				remarks,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal menambah customer.",
		};
	}

	revalidatePath(`/customers`);
	return { data: result };
};

export const createCustomer = createSafeAction(CustomerSchema, handler);
