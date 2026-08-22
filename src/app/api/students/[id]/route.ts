import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/students/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: { user: true, class: true },
    })
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(student)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/students/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (body.action === 'toggle_status') {
      const student = await prisma.studentProfile.findUnique({ where: { id } })
      if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })
      
      const newStatus = !student.isActive
      const updated = await prisma.studentProfile.update({
        where: { id },
        data: { 
          isActive: newStatus,
          leftAt: newStatus ? null : new Date() 
        }
      })
      return NextResponse.json({ success: true, isActive: newStatus })
    }

    const { name, email, admissionNumber, classId } = body

    const student = await prisma.studentProfile.findUnique({
      where: { id },
      include: { user: true },
    })
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })

    // Update user name/email
    await prisma.user.update({
      where: { id: student.userId },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
    })

    // Update student profile
    const updatedProfile = await prisma.studentProfile.update({
      where: { id },
      data: {
        ...(admissionNumber ? { admissionNumber } : {}),
        ...(classId ? { classId } : {}),
      },
      include: { user: true, class: true },
    })

    return NextResponse.json(updatedProfile)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/students/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const student = await prisma.studentProfile.findUnique({ where: { id } })
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Delete profile first, then user
    await prisma.studentProfile.delete({ where: { id } })
    await prisma.user.delete({ where: { id: student.userId } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
