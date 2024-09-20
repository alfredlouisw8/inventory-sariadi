import { z } from 'zod'

export const InvoiceSchema = z.object({
  invoiceCode: z.string().min(1, {
    message: 'Harus diisi',
  }),
  customerId: z.string(),
  paymentDate: z.date().optional(),
  remarks: z.string(),
  tax: z.boolean(),
  serviceIds: z.array(z.string()),
  invoiceId: z.string(),
  totalPrice: z.number(),
})
