import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hash } from "bcryptjs"
import { generateTempPassword } from "@/lib/password"

// PATCH /api/staff/[id] — reset teacher password
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    const newPassword = generateTempPassword()
    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      email: user.email,
      tempPassword: newPassword,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
