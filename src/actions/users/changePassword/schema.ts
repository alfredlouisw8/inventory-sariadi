import { z } from 'zod'

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Minimal 6 karakter'), // Simple validation
    newPassword: z.string().min(6, 'Minimal 6 karakter'), // Simple validation
    retypePassword: z.string(),
  })
  .refine((data) => data.newPassword === data.retypePassword, {
    path: ['retypePassword'],
    message: 'Password harus sama',
  })
