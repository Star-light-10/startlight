import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, action, rejectionReason, adminName } = body

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, action" },
        { status: 400 }
      )
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    const existing = await prisma.manualPayment.findUnique({ where: { id: paymentId } })
    if (!existing) {
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 })
    }

    if (existing.status !== "pending_verification") {
      return NextResponse.json(
        { error: "This payment has already been processed." },
        { status: 409 }
      )
    }

    const now = new Date()

    if (action === "approve") {
      await prisma.manualPayment.update({
        where: { id: paymentId },
        data: {
          status: "verified",
          verifiedBy: adminName || "Admin",
          verifiedAt: now,
        },
      })

      // TODO: Send confirmation email to student when email provider is configured
      // await sendStudentConfirmation(existing)

      return NextResponse.json({
        message: "Payment verified and approved successfully.",
      })
    }

    // action === "reject"
    if (!rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required when rejecting a payment." },
        { status: 400 }
      )
    }

    await prisma.manualPayment.update({
      where: { id: paymentId },
      data: {
        status: "rejected",
        verifiedBy: adminName || "Admin",
        verifiedAt: now,
        rejectionReason,
      },
    })

    // TODO: Send rejection email to student when email provider is configured
    // await sendStudentRejection(existing, rejectionReason)

    return NextResponse.json({
      message: "Payment rejected.",
    })
  } catch (error) {
    console.error("Verify manual payment error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
