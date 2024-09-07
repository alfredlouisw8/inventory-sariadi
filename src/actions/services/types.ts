import { z } from "zod";
import { Service } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { ServiceSchema } from "./schema";

export type InputType = z.infer<typeof ServiceSchema>;
export type ReturnType = ActionState<InputType, Service>;
