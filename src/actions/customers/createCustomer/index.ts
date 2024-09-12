"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "../types";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { CustomerSchema } from "../schema";
import { LogAction, LogObject } from "@prisma/client";
import { createLogEntry, generateLogMessage } from "@/actions/logs/functions";

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
		result = await prisma.$transaction(async (prisma) => {
			const customer = await prisma.customer.create({
				data: {
					name,
					company,
					remarks,
				},
			});

			// Generate a log for this action
			const logMessage = generateLogMessage(
				session.user.name as string,
				LogAction.Create,
				LogObject.Customer,
				"customer",
				customer.name,
				true
			);

			await createLogEntry(
				session.user.id as string,
				LogAction.Create,
				LogObject.Customer,
				customer.id,
				logMessage
			);

			return customer;
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
