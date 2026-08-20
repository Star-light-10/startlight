import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, startDate, endDate, isActive } = await request.json()
    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Name, start date, and end date are required" }, { status: 400 })
    }

    // If activating, deactivate all others first
    if (isActive) {
      const term = await prisma.academicTerm.findUnique({ where: { id } })
      if (term) {
        await prisma.academicTerm.updateMany({
          where: { tenantId: term.tenantId, isActive: true, NOT: { id } },
          data: { isActive: false },
        })
      }
    }

    const updated = await prisma.academicTerm.update({
      where: { id },
      data: { name, startDate: new Date(startDate), endDate: new Date(endDate), isActive: !!isActive },
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.academicTerm.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
