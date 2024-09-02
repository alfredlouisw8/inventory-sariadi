import { z } from "zod";

export const CreateInvoice = z.object({
	invoiceId: z.string().min(1, {
		message: "Required",
	}),
	customerId: z.string(),
	paymentDate: z.date().optional(),
	remarks: z.string(),
	tax: z.boolean(),
	serviceIds: z.array(z.string()),
});
