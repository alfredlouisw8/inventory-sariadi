import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";
import { LogSchema } from "./schema";
import { Log } from "@prisma/client";

export type InputType = z.infer<typeof LogSchema>;
export type ReturnType = ActionState<InputType, Log>;
