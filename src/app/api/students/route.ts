import { NextResponse } from "next/server"
import prisma from "@/lib/db"

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
