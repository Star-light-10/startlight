import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { students: true },
        },
      },
    })
    return NextResponse.json(classes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, section, capacity, tenantId } = data
    
    if (!name) return NextResponse.json({ error: "Class name is required" }, { status: 400 })
    
    // In a real app, tenantId comes from session. Hardcoding for now if missing.
    const actualTenantId = tenantId || (await prisma.tenant.findFirst())?.id
    
    if (!actualTenantId) {
       return NextResponse.json({ error: "No tenant found" }, { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        section,
        capacity: capacity ? parseInt(capacity) : null,
        tenantId: actualTenantId,
      },
    })
    
    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
