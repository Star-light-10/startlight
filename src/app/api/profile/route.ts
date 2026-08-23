import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, currentPassword, newPassword } = body

    // --- Update name only ---
    if (name && !currentPassword && !newPassword) {
      const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name.trim() }
      })
      return NextResponse.json({ success: true, name: updated.name })
    }

    // --- Change password ---
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (!user?.password) {
        return NextResponse.json({ error: "Cannot change password for this account." }, { status: 400 })
      }

      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 })
      }

      const hashed = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashed }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: error.message ?? "Failed to update profile" }, { status: 500 })
  }
}
