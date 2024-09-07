"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { ServiceSchema } from "../schema";
import { PrismaPromise } from "@prisma/client";
import { revertInventoryChanges } from "../functions";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
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
