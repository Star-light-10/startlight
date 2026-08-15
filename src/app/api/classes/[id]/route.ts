import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true }
        }
      }
    })

    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    if (classExists._count.students > 0) {
      return NextResponse.json({ error: "Cannot delete a class that has students enrolled in it." }, { status: 400 })
    }

    await prisma.class.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
  }
}
