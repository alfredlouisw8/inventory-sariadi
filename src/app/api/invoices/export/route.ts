import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma' // Adjust the path to your Prisma client instance
import { exportInvoicesData } from '@/actions/invoices/exportInvoices'
import { Type } from 'lucide-react'

export async function GET(req: NextRequest) {
  try {
    // Get the customerId from the query parameters
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get('customerId')
    const toValue = searchParams.get('to')
    const fromValue = searchParams.get('from')
    const type = searchParams.get('type')

    if (!fromValue || !toValue || !type) {
      return NextResponse.json({ error: 'Input error' }, { status: 400 })
    }

    // Fetch goods based on customerId
    const result = await exportInvoicesData(
      customerId,
      fromValue,
      toValue,
      type
    )

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching goods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch goods' },
      { status: 500 }
    )
  }
}
