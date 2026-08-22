import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hash } from "bcryptjs"
import { generateTempPassword } from "@/lib/password"

// PATCH /api/staff/[id] — update teacher or reset password
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const user = await prisma.user.findUnique({ where: { id }, include: { teacherProfile: true } })
    if (!user) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    if (body.action === 'reset_password') {
      const newPassword = generateTempPassword()
      const hashedPassword = await hash(newPassword, 10)
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      })

      // Send email
      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = require("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Starlight Admin <admin@starlight.edu.ng>",
            to: user.email!,
            subject: "Password Reset - Starlight Model School",
            html: `
              <h2>Password Reset</h2>
              <p>Dear ${user.name},</p>
              <p>Your teacher portal password has been reset by an administrator.</p>
              <p>Here are your new login credentials:</p>
              <ul>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Temporary Password:</strong> ${newPassword}</li>
              </ul>
              <p>Please log in and change your password immediately.</p>
              <br>
              <p>Best regards,<br>School Management</p>
            `,
          });
        } catch (err) {
          console.error("Failed to send reset email:", err);
        }
      }

      return NextResponse.json({ success: true, email: user.email, tempPassword: newPassword })
    }

    if (body.action === 'toggle_status') {
      if (!user.teacherProfile) return NextResponse.json({ error: "Profile missing" }, { status: 400 })
      const newStatus = !user.teacherProfile.isActive
      await prisma.teacherProfile.update({
        where: { id: user.teacherProfile.id },
        data: { 
          isActive: newStatus,
          leftAt: newStatus ? null : new Date() 
        }
      })
      return NextResponse.json({ success: true, isActive: newStatus })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/staff/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({ where: { id }, include: { teacherProfile: true } })
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (user.teacherProfile) {
      await prisma.teacherProfile.delete({ where: { id: user.teacherProfile.id } })
    }
    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
