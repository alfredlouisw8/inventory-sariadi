import { z } from "zod";

export const GoodSchema = z.object({
	name: z.string().min(1, {
		message: "Harus diisi",
	}),
	specification: z.string(),
	packing: z.string(),
	currentCount: z.number(),
	remarks: z.string(),
	customerId: z.string(),
	goodId: z.string(),
});
