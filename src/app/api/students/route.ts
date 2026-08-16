import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")
    
    const students = await prisma.studentProfile.findMany({
      where: classId ? { classId } : undefined,
      include: {
        user: true,
        class: true,
      },
      orderBy: { admissionNumber: "desc" },
    })

    const formattedStudents = students.map((s) => ({
      id: s.id,
      admissionNumber: s.admissionNumber,
      name: s.user.name,
      class: s.class?.name || "Unassigned",
      status: "Active", // For now
      user: { name: s.user.name } // Include user object directly for Attendance Manager component
    }))

    return NextResponse.json(formattedStudents)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Support both single object and array of objects
    const studentsArray = Array.isArray(data) ? data : [data];
    
    if (studentsArray.length === 0) {
      return NextResponse.json({ error: "No students provided" }, { status: 400 });
    }

    // Default tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: "System not properly initialized. No tenant found." }, { status: 500 });
    }

    const createdStudents = [];
    
    // We process sequentially to ensure admission numbers are correct
    for (const studentData of studentsArray) {
      const { firstName, lastName, className, gender, parentPhone, parentName } = studentData;
      
      if (!firstName || !lastName || !className) {
        continue; // Skip invalid rows
      }

      const result = await prisma.$transaction(async (tx) => {
        const targetClass = await tx.class.findFirst({
          where: { name: className, tenantId: tenant.id }
        });

        if (!targetClass) {
          throw new Error(`Class '${className}' does not exist.`);
        }

        const count = await tx.studentProfile.count();
        const admissionNumber = `SMS/26/${String(count + 1).padStart(4, '0')}`;
        
        const uniqueEmail = `student_${admissionNumber.replace(/\//g, '')}@starlight.edu.ng`.toLowerCase();
        const plainPassword = Math.random().toString(36).slice(-8) + "!";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        const newUser = await tx.user.create({
          data: {
            name: `${firstName} ${lastName}`,
            email: uniqueEmail,
            password: hashedPassword,
            role: "STUDENT",
            tenantId: tenant.id,
          }
        });

        const newProfile = await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            admissionNumber,
            classId: targetClass.id,
          }
        });

        return {
          id: newProfile.id,
          admissionNumber,
          name: newUser.name,
          email: uniqueEmail,
          password: plainPassword,
          class: className
        };
      });
      
      createdStudents.push(result);
    }

    return NextResponse.json({
      success: true,
      count: createdStudents.length,
      students: createdStudents
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to add students" }, { status: 500 });
  }
}
