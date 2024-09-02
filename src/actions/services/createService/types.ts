import { z } from "zod";
import { Service } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateService } from "./schema";

export type InputType = z.infer<typeof CreateService>;
export type ReturnType = ActionState<InputType, Service>;
