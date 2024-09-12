"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { CustomerSchema } from "../schema";
import { InputType, ReturnType } from "../types";
import { createLogEntry, generateLogMessage } from "@/actions/logs/functions";
import { LogAction, LogObject, Role } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	if (session.user.role !== Role.SUPER_ADMIN) {
		return {
			error: "Anda tidak punya akses",
		};
	}

	let result;

	const { customerId } = data;

	try {
		result = await prisma.$transaction(async (prisma) => {
			const customer = await prisma.customer.delete({
				where: {
					id: customerId,
				},
			});

			// Generate a log for this action
			const logMessage = generateLogMessage(
				session.user.name as string,
				LogAction.Delete,
				LogObject.Customer,
				"customer",
				customer.name,
				true
			);
			await createLogEntry(
				session.user.id as string,
				LogAction.Delete,
				LogObject.Customer,
				customer.id,
				logMessage
			);

			return customer;
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
