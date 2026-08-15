import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

// ONE-TIME SETUP ROUTE - Creates the first admin user
// DELETE this file after first use for security!
export async function GET() {
  try {
    // Safety check - only run if no admin exists yet
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: { in: ["SUPER_ADMIN", "SCHOOL_OWNER"] }
      }
    })

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin already exists. This route is disabled.",
        email: existingAdmin.email
      })
    }

    const hashedPassword = await bcrypt.hash("Admin@Starlight2026", 10)

    const admin = await prisma.user.create({
      data: {
        name: "School Admin",
        email: "admin@starlightms.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    })

    return NextResponse.json({
      success: true,
      message: "✅ Admin account created successfully!",
      credentials: {
        email: "admin@starlightms.com",
        password: "Admin@Starlight2026",
        note: "Please change your password after first login!"
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
