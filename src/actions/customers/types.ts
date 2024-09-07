import { z } from "zod";
import { Customer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { CustomerSchema } from "./schema";

export type InputType = z.infer<typeof CustomerSchema>;
export type ReturnType = ActionState<InputType, Customer>;
