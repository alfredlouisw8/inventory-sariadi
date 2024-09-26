import {
  calculateProfit,
  getSellPriceBeforeTax,
  getSellPriceTotal,
  serviceTypeText,
} from '@/utils/functions'
import { format } from 'date-fns'
import prisma from '@/lib/prisma'
import { ExportInvoiceData } from '@/utils/types'

export async function exportInvoicesData(
  customerId: string | null,
  fromDate: string,
  toDate: string
): Promise<ExportInvoiceData> {
  try {
    // Fetch customer and services with related invoices in one query
    let customerInvoices = []

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          invoices: {
            where: {
              invoiceDate: {
                gte: new Date(fromDate), // `fromDate` is the start date (e.g., new Date('2023-01-01'))
                lte: new Date(toDate), // `toDate` is the end date (e.g., new Date('2023-12-31'))
              },
            },
            include: {
              services: true,
            },
          },
        },
      })

      if (!customer) {
        throw new Error('Customer not found')
      }

      customerInvoices.push(customer)
    } else {
      const customer = await prisma.customer.findMany({
        where: {
          invoices: {
            some: {
              invoiceDate: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
              },
            },
          },
        },
        include: {
          invoices: {
            where: {
              invoiceDate: {
                gte: new Date(fromDate), // `fromDate` is the start date (e.g., new Date('2023-01-01'))
                lte: new Date(toDate), // `toDate` is the end date (e.g., new Date('2023-12-31'))
              },
            },
            include: {
              services: true,
            },
          },
        },
      })

      if (!customer) {
        throw new Error('Customer not found')
      }

      customerInvoices = [...customer]
    }

    const data = customerInvoices.map((customer) => ({
      customerName: customer.name,
      invoices: customer.invoices.map((invoice) => {
        const buyPriceTotal = invoice.services.reduce(
          (acc, service) => acc + (service.buyPrice || 0),
          0
        )

        const sellPriceBeforeTax = getSellPriceBeforeTax(
          invoice.totalPrice || 0,
          invoice.services.map((s) => s.sellPrice || 0)
        )

        const sellPriceTotal = getSellPriceTotal(
          sellPriceBeforeTax,
          invoice.tax || false
        )

        const totalProfit = calculateProfit(buyPriceTotal, sellPriceBeforeTax)

        return {
          invoiceCode: invoice.invoiceCode,
          tax: invoice.tax ? 'Ya' : 'Tidak',
          paymentDate: invoice.paymentDate
            ? format(invoice.paymentDate, 'dd-MM-yyyy')
            : '-',
          invoiceDate: format(invoice.invoiceDate, 'dd-MM-yyyy'),
          buyPriceTotal,
          sellPriceBeforeTax,
          sellPriceTotal,
          totalProfit,
          remarks: invoice.remarks || '',
          services: invoice.services.map((service) => ({
            serviceType: serviceTypeText(service.serviceType),
            serviceCode: service.serviceCode,
            buyPrice: service.buyPrice || 0,
            sellPrice: service.sellPrice || 0,
            date: format(service.date, 'dd-MM-yyyy'),
            remarks: service.remarks || '',
          })),
        }
      }),
    }))

    return data

    // return data
  } catch (error) {
    console.error('Error exporting invoice data:', error)
    throw error // Optionally throw to notify caller
  }
}
