import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId") || undefined
    const termId = searchParams.get("termId") || undefined
    const search = searchParams.get("search") || undefined

    // Fetch all student profiles matching filters (with user + class)
    const students = await prisma.studentProfile.findMany({
      where: {
        ...(classId ? { classId } : {}),
        ...(search
          ? {
              OR: [
                { user: { name: { contains: search, mode: "insensitive" } } },
                { admissionNumber: { contains: search, mode: "insensitive" } }
              ]
            }
          : {})
      },
      include: {
        user: true,
        class: true,
        invoices: {
          where: {
            ...(termId ? { termId } : {})
          },
          include: {
            payments: {
              orderBy: { date: "desc" }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    // Build ledger rows
    const rows = students.map((student) => {
      // Pick the most recent invoice for the term (or any if no term filter)
      const invoice = student.invoices[0] ?? null

      return {
        studentId: student.id,
        name: student.user.name ?? "—",
        admissionNumber: student.admissionNumber,
        class: student.class.name,
        invoiceId: invoice?.id ?? null,
        totalAmount: invoice?.totalAmount ?? 0,
        amountPaid: invoice?.amountPaid ?? 0,
        balance: invoice ? invoice.totalAmount - invoice.amountPaid : 0,
        status: invoice ? invoice.status : "NO_INVOICE",
        payments: invoice?.payments ?? []
      }
    })

    return NextResponse.json(rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch ledger data" }, { status: 500 })
  }
}
