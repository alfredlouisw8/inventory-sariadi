"use server";

import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { InvoiceSchema } from "../schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	const {
		invoiceId,
		invoiceCode,
		paymentDate,
		tax,
		serviceIds,
		remarks,
		customerId,
	} = data;

	try {
		// Fetch the current services linked to this invoice
		const currentInvoice = await prisma.invoice.findUnique({
			where: { id: invoiceId },
			include: { services: true },
		});

		if (!currentInvoice) {
			return { error: "Invoice not found" };
		}

		// Extract the IDs of services currently linked to the invoice
		const currentServiceIds = currentInvoice.services.map(
			(service) => service.id
		);

		// Calculate services to remove (currently linked but not in new serviceIds)
		const servicesToRemove = currentServiceIds.filter(
			(id) => !serviceIds.includes(id)
		);

		// Calculate services to add (in new serviceIds but not currently linked)
		const servicesToAdd = serviceIds.filter(
			(id) => !currentServiceIds.includes(id)
		);

		// Start a transaction to update the invoice and services
		const [updatedInvoice] = await prisma.$transaction(async (prisma) => {
			// 1. Update the invoice
			const invoice = await prisma.invoice.update({
				where: { id: invoiceId },
				data: {
					invoiceCode,
					paymentDate,
					tax,
					remarks,
					customerId,
				},
			});

			// 2. Set `invoiceId` to `null` for services that are removed from this invoice
			const removeServices = servicesToRemove.length
				? await prisma.service.updateMany({
						where: { id: { in: servicesToRemove } },
						data: { invoiceId: null },
				  })
				: null;

			// 3. Update the services with the new invoiceId (i.e., add new services)
			const addServices = servicesToAdd.length
				? await prisma.service.updateMany({
						where: { id: { in: servicesToAdd } },
						data: { invoiceId: invoice.id },
				  })
				: null;

			return [invoice, removeServices, addServices];
		});

		// Revalidate the cache after successful operations
		revalidatePath(`/customers/${customerId}`);
		revalidatePath(`/invoices/${invoiceId}`);

		return { data: updatedInvoice };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal merubah invoice",
		};
	}
};

export const updateInvoice = createSafeAction(InvoiceSchema, handler);
