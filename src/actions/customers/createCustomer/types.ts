import { z } from "zod";
import { Customer } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateCustomer } from "./schema";

export type InputType = z.infer<typeof CreateCustomer>;
export type ReturnType = ActionState<InputType, Customer>;
