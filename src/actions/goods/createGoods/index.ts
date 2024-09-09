"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { GoodSchema } from "../schema";
import { createLogEntry, generateLogMessage } from "@/actions/logs/functions";
import { LogAction, LogObject } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	let result;

	const { name, specification, packing, currentCount, remarks, customerId } =
		data;

	try {
		result = await prisma.$transaction(async (prisma) => {
			const good = await prisma.good.create({
				data: {
					name,
					specification,
					packing,
					currentCount,
					customerId,
					remarks,
				},
			});

			const customer = await prisma.customer.findUnique({
				where: {
					id: customerId,
				},
				select: {
					name: true,
				},
			});

			// Generate a log for this action
			const logMessage = generateLogMessage(
				session.user.name as string,
				LogAction.Create,
				LogObject.Good,
				good.name,
				customer?.name as string
			);
			await createLogEntry(
				session.user.id as string,
				LogAction.Create,
				LogObject.Good,
				customerId,
				logMessage
			);

			return good;
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal menambah barang",
		};
	}

	revalidatePath(`/customers/${customerId}`);
	return { data: result };
};

export const createGood = createSafeAction(GoodSchema, handler);
