import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, code, tenantId } = data
    
    if (!name) return NextResponse.json({ error: "Subject name is required" }, { status: 400 })
    
    const actualTenantId = tenantId || (await prisma.tenant.findFirst())?.id
    if (!actualTenantId) {
       return NextResponse.json({ error: "No tenant found" }, { status: 400 })
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        tenantId: actualTenantId,
      },
    })
    
    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
