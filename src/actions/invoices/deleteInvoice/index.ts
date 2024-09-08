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

	const { invoiceId, customerId } = data;

	try {
		// 1. Find all services linked to this invoice
		const invoice = await prisma.invoice.findUnique({
			where: { id: invoiceId },
			include: { services: true },
		});

		if (!invoice) {
			return { error: "Invoice not found" };
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

		// 4. Revalidate the cache after successful deletion
		revalidatePath(`/customers/${customerId}`);
		return { data: deletedInvoice };
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Failed to delete invoice.",
		};
	}
};

export const deleteInvoice = createSafeAction(InvoiceSchema, handler);
