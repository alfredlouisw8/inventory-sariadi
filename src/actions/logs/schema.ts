import { z } from "zod";

export const LogSchema = z.object({
	logText: z.string().min(1, {
		message: "Harus diisi",
	}),
});
