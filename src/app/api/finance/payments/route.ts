import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get("invoiceId")

    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId query param is required" }, { status: 400 })
    }

    const payments = await prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { date: "desc" }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { invoiceId, amount, method, reference } = data
    
    if (!invoiceId || !amount || !method) {
      return NextResponse.json({ error: "Invoice ID, amount, and method are required" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId }
      })

      if (!invoice) throw new Error("Invoice not found")
      
      const paymentAmount = parseFloat(amount)
      
      if (paymentAmount <= 0) throw new Error("Amount must be greater than zero")
      if (invoice.amountPaid + paymentAmount > invoice.totalAmount) {
        throw new Error("Payment exceeds total invoice amount")
      }

      // Record the payment
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: paymentAmount,
          method,
          reference
        }
      })

      // Update the invoice status and amount paid
      const newAmountPaid = invoice.amountPaid + paymentAmount
      const newStatus = newAmountPaid >= invoice.totalAmount ? "PAID" : newAmountPaid > 0 ? "PARTIAL" : "PENDING"

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          status: newStatus
        }
      })

      return { payment, invoice: updatedInvoice }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 })
  }
}
