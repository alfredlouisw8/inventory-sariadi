import prisma from '@/lib/prisma'

export default async function getInvoices(customerId?: string | undefined) {
  if (!customerId) {
    const response = await prisma.invoice.findMany({
      include: {
        customer: true,
      },
    })

    return response
  }

  const response = await prisma.invoice.findMany({
    where: {
      customerId,
    },
  })

  return response
}
