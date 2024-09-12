"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { ServiceSchema } from "../schema";
import { LogAction, LogObject, PrismaPromise, Role } from "@prisma/client";
import { revertInventoryChanges } from "../functions";
import {
	createLogEntrySync,
	generateLogMessage,
} from "@/actions/logs/functions";

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

	const { serviceId } = data;

	try {
		// 1. Fetch the service and related serviceGoods
		const service = await prisma.service.findUnique({
			where: { id: serviceId },
			include: { serviceGoods: true },
		});

		if (!service) {
			return { error: "Service not found" };
		}

		const transactions: PrismaPromise<any>[] = [];

		// 2. Revert the inventory calculation
		transactions.push(
			...revertInventoryChanges(
				service.serviceCalculationType,
				service.serviceGoods
			)
		);

		// 3. Delete the service after reverting the inventory
		transactions.push(
			prisma.service.delete({
				where: {
					id: serviceId,
				},
			})
		);

		const customer = await prisma.customer.findUnique({
			where: {
				id: service.customerId,
			},
		});

		const logMessage = generateLogMessage(
			session.user.name as string,
			LogAction.Delete,
			LogObject.Service,
			service.serviceCode,
			customer?.name as string
		);
		const logEntry = createLogEntrySync(
			session.user.id as string,
			LogAction.Create,
			LogObject.Service,
			customer?.id as string,
			logMessage
		);

		transactions.push(logEntry);

		// 4. Execute all the transactions
		const [deletedService] = await prisma.$transaction(transactions);

		// Revalidate the path to update the client UI
		revalidatePath(`/customers/${deletedService.customerId}`);
		return { data: deletedService };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal menghapus jasa",
		};
	}
};

export const deleteService = createSafeAction(ServiceSchema, handler);
