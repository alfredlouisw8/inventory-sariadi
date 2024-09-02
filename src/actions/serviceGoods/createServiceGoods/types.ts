import { z } from "zod";
import { ServiceGood } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateServiceGood } from "./schema";

export type InputType = z.infer<typeof CreateServiceGood>;
export type ReturnType = ActionState<InputType, ServiceGood>;
