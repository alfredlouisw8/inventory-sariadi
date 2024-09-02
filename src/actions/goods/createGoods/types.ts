import { z } from "zod";
import { Good } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateGood } from "./schema";

export type InputType = z.infer<typeof CreateGood>;
export type ReturnType = ActionState<InputType, Good>;
