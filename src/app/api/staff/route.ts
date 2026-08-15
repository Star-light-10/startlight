import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hash } from "bcryptjs"
import { generateTempPassword, generateEmployeeId } from "@/lib/password"

// GET — list all staff/teachers
export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: { role: "TEACHER" },
      include: { teacherProfile: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(staff)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — create a new teacher
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Find or create default tenant
    let tenant = await prisma.tenant.findFirst()
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Starlight Model School",
          domain: "startlightms.vercel.app",
        },
      })
    }

    // Generate credentials
    const password = generateTempPassword()
    const hashedPassword = await hash(password, 10)
    
    // Generate Employee ID
    const teacherCount = await prisma.teacherProfile.count()
    const employeeId = generateEmployeeId(teacherCount)

    // Create user and profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          role: "TEACHER",
          tenantId: tenant.id,
        },
      })

      await tx.teacherProfile.create({
        data: {
          userId: newUser.id,
          employeeId,
        },
      })

      return newUser
    })

    return NextResponse.json({
      success: true,
      user,
      tempPassword: password, // Returning so admin can copy it
      employeeId
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
