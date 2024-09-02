import { z } from "zod";
import { Invoice } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateInvoice } from "./schema";

export type InputType = z.infer<typeof CreateInvoice>;
export type ReturnType = ActionState<InputType, Invoice>;
