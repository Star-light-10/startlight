import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// PATCH /api/academics/classes/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, section, capacity } = await request.json()
    if (!name) return NextResponse.json({ error: "Class name is required" }, { status: 400 })

    const updated = await prisma.class.update({
      where: { id },
      data: { name, section: section || null, capacity: capacity ? parseInt(capacity) : null },
    })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/academics/classes/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.class.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
