import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/results/[id] — fetch a full report card by reportCardId for printing

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = await prisma.reportCard.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        term: true,
        grades: {
          include: { subject: true },
          orderBy: { subject: { name: "asc" } },
        },
      },
    })

    if (!card) {
      return NextResponse.json({ error: "Report card not found" }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error: any) {
    console.error("[GET /api/results/[id]]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
