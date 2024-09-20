'use server'

import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/create-safe-action'
import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import {
  LogAction,
  LogObject,
  PrismaPromise,
  Role,
  ServiceCalculationType,
  ServiceType,
} from '@prisma/client'
import { InputType, ReturnType } from '../types'
import { ServiceSchema } from '../schema'
import { revertInventoryChanges } from '../functions'
import {
  createLogEntrySync,
  generateLogMessage,
} from '@/actions/logs/functions'

const handler = async (data: InputType): Promise<ReturnType> => {
  const session = await auth()

  if (!session?.user) {
    return {
      error: 'Silahkan login',
    }
  }

  if (session.user.role === Role.USER) {
    return {
      error: 'Anda tidak punya akses',
    }
  }

  const {
    serviceType,
    serviceCalculationType,
    date,
    buyPrice,
    sellPrice,
    remarks,
    customerId,
    goods,
    serviceId,
  } = data

  try {
    // 1. Fetch the current service data including the serviceGoods and calculation types
    const previousService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { serviceGoods: true },
    })

    if (!previousService) {
      return { error: 'Service not found' }
    }

    const transactions: PrismaPromise<any>[] = []

    // 2. Revert the previous calculation
    transactions.push(
      ...revertInventoryChanges(
        previousService.serviceCalculationType,
        previousService.serviceGoods
      )
    )

    // 3. Update the service with new data and upsert the related serviceGoods
    transactions.push(
      prisma.service.update({
        where: { id: serviceId },
        data: {
          serviceType: serviceType as ServiceType,
          serviceCalculationType:
            serviceCalculationType as ServiceCalculationType,
          date,
          remarks,
          buyPrice,
          sellPrice,
          profit: sellPrice - buyPrice,
          serviceGoods: {
            upsert: goods.map(
              ({ goodId, goodCount, containerNumber, truckNumber }) => ({
                where: {
                  goodId_serviceId: {
                    goodId,
                    serviceId,
                  },
                },
                update: {
                  goodCount,
                  containerNumber,
                  truckNumber,
                },
                create: {
                  goodId,
                  goodCount,
                  containerNumber,
                  truckNumber,
                  customerId,
                },
              })
            ),
          },
        },
      })
    )

    // 4. Apply the new calculation to the goods, skipping if the type is `Equal`
    const goodsUpdates = goods.reduce((acc, { goodCount, goodId }) => {
      let calculationType = {}

      // Skip calculation if serviceCalculationType is Equal
      if (serviceCalculationType === ServiceCalculationType.Equal) {
        return acc
      }

      switch (serviceCalculationType) {
        case ServiceCalculationType.Add:
          calculationType = { increment: goodCount }
          break
        case ServiceCalculationType.Substract:
          calculationType = { decrement: goodCount }
          break
        default:
          break
      }

      acc.push(
        prisma.good.update({
          where: { id: goodId },
          data: { currentCount: calculationType },
        })
      )

      return acc
    }, [] as PrismaPromise<any>[])

    const customer = await prisma.customer.findUnique({
      where: {
        id: previousService.customerId,
      },
    })

    const logMessage = generateLogMessage(
      session.user.name as string,
      LogAction.Update,
      LogObject.Service,
      previousService.serviceCode,
      customer?.name as string
    )

    const logEntry = createLogEntrySync(
      session.user.id as string,
      LogAction.Update,
      LogObject.Service,
      customer?.id as string,
      logMessage
    )

    // 5. Combine all transactions (service update + goods updates)
    const allTransactions = [...transactions, ...goodsUpdates, logEntry]

    // Run all transactions in a batch
    const [service] = await prisma.$transaction(allTransactions)

    // Revalidate the path after update
    revalidatePath(`/customers/${customerId}`)
    revalidatePath(`/services/${serviceId}`)
    return { data: service }
  } catch (error: any) {
    console.error(error.message)
    return {
      error: error.message || 'Gagal merubah jasa',
    }
  }
}

export const updateService = createSafeAction(ServiceSchema, handler)
