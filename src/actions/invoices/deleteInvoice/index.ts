"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { InvoiceSchema } from "../schema";
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

	const { invoiceId, customerId } = data;

	try {
		const result = await prisma.$transaction(async (prisma) => {
			// 1. Find all services linked to this invoice
			const invoice = await prisma.invoice.findUnique({
				where: { id: invoiceId },
				include: { services: true },
			});

			if (!invoice) {
				throw new Error("Invoice not found");
			}

			// 2. Set `invoiceId` to `null` for all services linked to this invoice
			const serviceIds = invoice.services.map((service) => service.id);
			if (serviceIds.length > 0) {
				await prisma.service.updateMany({
					where: { id: { in: serviceIds } },
					data: { invoiceId: null },
				});
			}

			// 3. Delete the invoice
			const deletedInvoice = await prisma.invoice.delete({
				where: { id: invoiceId },
			});

			// 4. Find the customer name for logging
			const customer = await prisma.customer.findUnique({
				where: {
					id: customerId,
				},
				select: {
					name: true,
				},
			});

			// 5. Generate a log for this action
			const logMessage = generateLogMessage(
				session.user.name as string,
				LogAction.Delete,
				LogObject.Invoice,
				invoice.invoiceCode,
				customer?.name as string
			);

			await createLogEntry(
				session.user.id as string,
				LogAction.Delete,
				LogObject.Invoice,
				customerId,
				logMessage
			);

			// Return the deleted invoice
			return deletedInvoice;
		});

		// 6. Revalidate the cache after successful deletion
		revalidatePath(`/customers/${customerId}`);
		return { data: result };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to delete invoice.",
		};
	}
};

export const deleteInvoice = createSafeAction(InvoiceSchema, handler);
