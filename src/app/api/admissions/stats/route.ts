import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const [
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalStudents,
    ] = await Promise.all([
      prisma.admissionApplication.count(),
      prisma.admissionApplication.count({ where: { status: "PENDING" } }),
      prisma.admissionApplication.count({ where: { status: "ACCEPTED" } }),
      prisma.admissionApplication.count({ where: { status: "REJECTED" } }),
      prisma.studentProfile.count(),
    ])

    return NextResponse.json({
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      totalStudents,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
