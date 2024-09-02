"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { CreateCustomer } from "./schema";
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
			error: error.message || "Failed to create customer.",
		};
	}

	revalidatePath(`/customers`);
	return { data: result };
};

export const createCustomer = createSafeAction(CreateCustomer, handler);
