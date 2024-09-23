import { z } from 'zod'
import { User } from '@prisma/client'

import { ActionState } from '@/lib/create-safe-action'

import { ChangePasswordSchema } from './schema'

export type InputType = z.infer<typeof ChangePasswordSchema>
export type ReturnType = ActionState<InputType, User>
