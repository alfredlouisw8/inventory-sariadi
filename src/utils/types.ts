import { Invoice, Service, ServiceGood } from '@prisma/client'

// Extend the Service type to include serviceGoods
export type ServiceWithGoods = Service & {
  serviceGoods: ServiceGood[]
}

export type InvoiceWithServices = Invoice & {
  services: Service[]
}

export type ExportInvoiceData = {
  customerName: string
  invoices: {
    invoiceCode: string
    tax: string
    paymentDate: string
    invoiceDate: string
    buyPriceTotal: number
    sellPriceBeforeTax: number
    sellPriceTotal: number
    totalProfit: number
    remarks: string
    services: {
      serviceType: string
      serviceCode: string
      buyPrice: number
      sellPrice: number
      date: string
      remarks: string
    }[]
  }[]
}[]
