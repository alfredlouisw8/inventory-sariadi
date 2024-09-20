import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma' // Adjust the path to your Prisma client instance
import { exportInvoicesData } from '@/actions/invoices/exportInvoices'

export async function GET(req: NextRequest) {
  try {
    // Get the customerId from the query parameters
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')
    const toDate = searchParams.get('toDate')
    const fromDate = searchParams.get('fromDate')

    if (!toDate || !fromDate) {
      return NextResponse.json(
        { error: 'Silahkan pilih tanggal dulu' },
        { status: 400 }
      )
    }

    // Fetch goods based on customerId
    const result = await exportInvoicesData(customerId, fromDate, toDate)

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching goods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goods' },
      { status: 500 }
    )
  }
}
