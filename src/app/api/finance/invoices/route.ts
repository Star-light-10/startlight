import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

import { getServerSession } from "next-auth"
import authConfig from "@/auth.config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let whereClause = {}
    
    // If student, filter by their profile
    if ((session.user as any).role === "STUDENT") {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id }
      })
      if (profile) {
        whereClause = { studentId: profile.id }
      } else {
        return NextResponse.json([]) // No profile yet
      }
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        student: {
          include: { user: true, class: true }
        },
        term: true,
        payments: true
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { classId, termId } = data
    
    if (!classId || !termId) {
      return NextResponse.json({ error: "classId and termId are required to generate invoices" }, { status: 400 })
    }

    // Find the fee structures for this class and term
    const fees = await prisma.feeStructure.findMany({
      where: { classId, termId }
    })

    if (fees.length === 0) {
      return NextResponse.json({ error: "No fee structure found for this class and term." }, { status: 400 })
    }

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0)

    // Find all students in this class
    const students = await prisma.studentProfile.findMany({
      where: { classId }
    })

    if (students.length === 0) {
      return NextResponse.json({ error: "No students enrolled in this class." }, { status: 400 })
    }

    let createdCount = 0

    // Create an invoice for each student if they don't already have one for this term
    for (const student of students) {
      const existing = await prisma.invoice.findFirst({
        where: { studentId: student.id, termId }
      })

      if (!existing) {
        await prisma.invoice.create({
          data: {
            studentId: student.id,
            termId,
            totalAmount,
            amountPaid: 0,
            status: "PENDING"
          }
        })
        createdCount++
      }
    }
    
    return NextResponse.json({ message: `Generated ${createdCount} new invoices.` }, { status: 201 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Failed to generate invoices" }, { status: 500 })
  }
}
