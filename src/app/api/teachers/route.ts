import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      include: {
        teacherProfile: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    // Default tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: "System not properly initialized. No tenant found." }, { status: 500 });
    }

    // Generate random password
    const plainPassword = Math.random().toString(36).slice(-8) + "!";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Generate Employee ID
    const count = await prisma.teacherProfile.count();
    const employeeId = `TCH/26/${String(count + 1).padStart(3, '0')}`;

    const newTeacher = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: "TEACHER",
        tenantId: tenant.id,
        teacherProfile: {
          create: {
            employeeId: employeeId
          }
        }
      },
      include: {
        teacherProfile: true
      }
    });

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: newTeacher.email!,
          subject: "Welcome to Starlight School - Teacher Portal",
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #000080;">Welcome to Starlight School!</h2>
              <p>Dear ${newTeacher.name},</p>
              <p>An account has been created for you on the Starlight School Portal.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your Login Credentials:</strong></p>
                <p style="margin: 5px 0 0 0;">Email: <strong>${newTeacher.email}</strong></p>
                <p style="margin: 5px 0 0 0;">Password: <strong>${plainPassword}</strong></p>
                <p style="margin: 5px 0 0 0;">Employee ID: <strong>${employeeId}</strong></p>
              </div>
              <p>Please log in and change your password as soon as possible.</p>
              <a href="https://startlightms.vercel.app/login" style="display: inline-block; padding: 10px 20px; background-color: #000080; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Email failed to send, but teacher was created:", emailErr);
        // We do not fail the request if the email fails, but maybe return a warning
      }
    }

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
