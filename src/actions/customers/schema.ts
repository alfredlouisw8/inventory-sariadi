import { z } from "zod";

export const CustomerSchema = z.object({
	name: z.string().min(1, {
		message: "Harus diisi",
	}),
	company: z.string(),
	remarks: z.string(),
	customerId: z.string(),
});
