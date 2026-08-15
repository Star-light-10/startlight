import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user || (session.user as any).role === "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.manualPayment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: { include: { class: true } }
      }
    });

    return NextResponse.json(payments);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch manual payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the student profile for this user
    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const data = await request.json();
    const { amountPaid, purpose, invoiceId } = data;

    if (!amountPaid || !purpose) {
      return NextResponse.json({ error: "Amount and purpose are required" }, { status: 400 });
    }

    // Create a manual payment record that requires admin verification
    const manualPayment = await prisma.manualPayment.create({
      data: {
        studentId: student.id,
        studentName: session.user.name || "Student",
        matricNumber: student.admissionNumber,
        amountPaid: parseFloat(amountPaid),
        purpose: purpose,
        status: "pending_verification"
      }
    });

    return NextResponse.json({ success: true, payment: manualPayment }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit payment" }, { status: 500 });
  }
}
