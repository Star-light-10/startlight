import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, studentName, matricNumber, amountPaid, purpose, receiptUrl } = body

    if (!studentId || !studentName || !matricNumber || !amountPaid) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, studentName, matricNumber, amountPaid" },
        { status: 400 }
      )
    }

    if (isNaN(Number(amountPaid)) || Number(amountPaid) <= 0) {
      return NextResponse.json(
        { error: "Amount paid must be a positive number." },
        { status: 400 }
      )
    }

    const payment = await prisma.manualPayment.create({
      data: {
        studentId,
        studentName,
        matricNumber,
        amountPaid: Number(amountPaid),
        purpose: purpose || "school_fees",
        receiptUrl: receiptUrl || null,
        status: "pending_verification",
      },
    })

    // TODO: Send email notification to admin when email provider is configured
    // await sendAdminNotification(payment)

    return NextResponse.json(
      {
        message: "Payment declaration submitted successfully. Awaiting admin verification.",
        paymentId: payment.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Submit manual payment error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const payments = await prisma.manualPayment.findMany({
      orderBy: { submittedAt: "desc" },
    })
    return NextResponse.json(payments)
  } catch (error) {
    console.error("Fetch manual payments error:", error)
    return NextResponse.json({ error: "Failed to fetch payments." }, { status: 500 })
  }
}
