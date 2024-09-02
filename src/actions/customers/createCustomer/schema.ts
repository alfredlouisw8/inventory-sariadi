import { z } from "zod";

export const CreateCustomer = z.object({
	name: z.string().min(1, {
		message: "Required",
	}),
	company: z.string(),
	remarks: z.string(),
});
