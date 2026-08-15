import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const students = await prisma.studentProfile.findMany({
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
    }))

    return NextResponse.json(formattedStudents)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
