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

    // Send email to teacher
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Starlight Admin <admin@starlight.edu.ng>",
          to: email.trim().toLowerCase(),
          subject: "Your Teacher Login Credentials - Starlight Model School",
          html: `
            <h2>Welcome to Starlight Model School!</h2>
            <p>Dear ${name.trim()},</p>
            <p>Your teacher portal account has been created successfully.</p>
            <p>Here are your login credentials:</p>
            <ul>
              <li><strong>Email:</strong> ${email.trim().toLowerCase()}</li>
              <li><strong>Temporary Password:</strong> ${password}</li>
            </ul>
            <p>Please log in and change your password as soon as possible.</p>
            <br>
            <p>Best regards,<br>School Management</p>
          `,
        });
      } catch (err) {
        console.error("Failed to send teacher creation email:", err);
      }
    }

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
