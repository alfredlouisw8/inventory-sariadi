import { z } from "zod";

export const CreateGood = z.object({
	name: z.string().min(1, {
		message: "Required",
	}),
	specification: z.string(),
	packing: z.string(),
	currentCount: z.number(),
	remarks: z.string(),
	customerId: z.string(),
});
