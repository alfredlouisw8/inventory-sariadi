import { z } from "zod";
import { Invoice } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { InvoiceSchema } from "./schema";

export type InputType = z.infer<typeof InvoiceSchema>;
export type ReturnType = ActionState<InputType, Invoice>;
