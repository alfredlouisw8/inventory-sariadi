import { z } from 'zod'

export const ServiceSchema = z.object({
  serviceId: z.string(),
  serviceType: z.string(),
  serviceCalculationType: z.string(),
  date: z.date(),
  remarks: z.string(),
  customerId: z.string(),
  buyPrice: z.number(),
  sellPrice: z.number(),
  goods: z.array(
    z.object({
      goodId: z.string(),
      goodCount: z.number(),
      containerNumber: z.string(),
      truckNumber: z.string(),
    })
  ),
  invoiceId: z.string().optional(),
})
