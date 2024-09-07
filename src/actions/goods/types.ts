import { z } from "zod";
import { Good } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";
import { GoodSchema } from "./schema";

export type InputType = z.infer<typeof GoodSchema>;
export type ReturnType = ActionState<InputType, Good>;
