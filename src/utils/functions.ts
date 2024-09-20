import { ServiceCalculationType, ServiceType } from '@prisma/client'
import { INCOME_TAX, PRICE_TAX } from './const'
import { InvoiceWithServices } from './types'

export function serviceTypeText(type: string) {
  switch (type) {
    case ServiceType.Loading:
      return 'Bongkar'
    case ServiceType.Unloading:
      return 'Muat'
    case ServiceType.Repacking:
      return 'Repacking'
    case ServiceType.RepackingWeighing:
      return 'Repacking + Timbang'
    case ServiceType.Stripping:
      return 'Stripping'
    case ServiceType.Storage:
      return 'Storage'
    case ServiceType.Overtime:
      return 'Lembur'
    default:
      // You may want to add a default return value or throw an error here
      return ''
  }
}

export function serviceCalculationTypeText(type: string) {
  switch (type) {
    case ServiceCalculationType.Add:
      return 'Tambah'
    case ServiceCalculationType.Substract:
      return 'Kurang'
    case ServiceCalculationType.Equal:
      return 'Tetap'
    default:
      // You may want to add a default return value or throw an error here
      return ''
  }
}

export function calculateProfit(buyPrice: number, sellPrice: number) {
  return sellPrice - sellPrice * INCOME_TAX - buyPrice
}

export function getSellPriceBeforeTax(
  totalPrice: number,
  sellPriceServices: number[]
) {
  return totalPrice && totalPrice > 0
    ? totalPrice
    : sellPriceServices.reduce((acc, sellPrice) => acc + (sellPrice || 0), 0)
}

export function getSellPriceTotal(sellPriceBeforeTax: number, tax: boolean) {
  return tax
    ? sellPriceBeforeTax + sellPriceBeforeTax * PRICE_TAX
    : sellPriceBeforeTax
}
