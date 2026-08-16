import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await auth();
    if (!session?.user || (session.user as any).role === "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    const manualPayment = await prisma.manualPayment.findUnique({
      where: { id: params.id },
      include: { student: true }
    });

    if (!manualPayment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (action === "VERIFY") {
      // 1. Update the manual payment record
      const updated = await prisma.manualPayment.update({
        where: { id: params.id },
        data: {
          status: "verified",
          verifiedBy: session.user.name || "Admin",
          verifiedAt: new Date()
        }
      });

      // 2. Try to find the corresponding invoice to apply the payment
      const pendingInvoice = await prisma.invoice.findFirst({
        where: { 
          studentId: manualPayment.studentId,
          status: { in: ["PENDING", "PARTIAL"] }
        },
        orderBy: { createdAt: 'asc' } // Apply to the oldest pending invoice
      });

      if (pendingInvoice) {
        const amountAsFloat = Number(manualPayment.amountPaid);
        const newAmountPaid = pendingInvoice.amountPaid + amountAsFloat;
        const newStatus = newAmountPaid >= pendingInvoice.totalAmount ? "PAID" : "PARTIAL";

        await prisma.invoice.update({
          where: { id: pendingInvoice.id },
          data: {
            amountPaid: newAmountPaid,
            status: newStatus
          }
        });

        // Add to payments log
        await prisma.payment.create({
          data: {
            invoiceId: pendingInvoice.id,
            amount: amountAsFloat,
            method: "Transfer (Verified)",
            reference: `MANUAL_PAY_${manualPayment.id}`
          }
        });
      }

      return NextResponse.json({ success: true, payment: updated });
    }

    if (action === "REJECT") {
      const updated = await prisma.manualPayment.update({
        where: { id: params.id },
        data: {
          status: "rejected",
          verifiedBy: session.user.name || "Admin",
          verifiedAt: new Date(),
          rejectionReason: "Invalid receipt or incomplete payment."
        }
      });
      return NextResponse.json({ success: true, payment: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
