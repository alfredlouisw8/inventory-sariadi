'use server'

import { createSafeAction } from '@/lib/create-safe-action'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { InputType, ReturnType } from './types'
import { ChangePasswordSchema } from './schema'
import bcrypt from 'bcryptjs'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  let result

  const { currentPassword, newPassword } = data

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user?.password as string
    )

    if (!isPasswordValid) {
      return {
        error: 'Password salah',
      }
    }

    result = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
      },
    })

    return { data: result }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal merubah password',
    }
  }

  return { data: result }
}

export const changePassword = createSafeAction(ChangePasswordSchema, handler)
