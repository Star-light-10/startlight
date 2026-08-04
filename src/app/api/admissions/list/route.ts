import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const applications = await prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(applications)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
