import { ServiceCalculationType } from "@prisma/client";
import { z } from "zod";

export const CreateServiceGood = z.object({
	serviceId: z.string(),
	serviceCalculationType: z.string(),
	goodId: z.string(),
	goodCount: z.number(),
	containerNumber: z.string(),
	truckNumber: z.string(),
});
