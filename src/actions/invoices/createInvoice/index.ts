"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { auth } from "@/lib/auth/auth";
import { CreateInvoice } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	const { invoiceId, paymentDate, tax, serviceIds, remarks, customerId } = data;

	try {
		// Start a transaction to create an invoice and update services
		const [invoice] = await prisma.$transaction(async (prisma) => {
			// Create a new invoice
			const invoice = await prisma.invoice.create({
				data: {
					invoiceId,
					paymentDate,
					tax,
					remarks,
					customerId,
				},
			});

			// Use the newly created invoice ID to update services
			const serviceUpdates = await Promise.all(
				serviceIds.map((serviceId) =>
					prisma.service.update({
						where: { id: serviceId },
						data: { invoiceId: invoice.id }, // Use the newly created invoice's ID here
					})
				)
			);

			return [invoice, ...serviceUpdates];
		});

		// Revalidate the cache after successful operations
		revalidatePath(`/customers/${customerId}`);
		return { data: invoice };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to create service.",
		};
	}
};

export const createInvoice = createSafeAction(CreateInvoice, handler);
