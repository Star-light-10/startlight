import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET — list all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(classes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — create a new class
export async function POST(request: NextRequest) {
  try {
    const { name, section, capacity } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: "Class name is required" }, { status: 400 })
    }

    // Find or create the default tenant
    let tenant = await prisma.tenant.findFirst()
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Starlight Model School",
          domain: "startlightms.vercel.app",
        },
      })
    }

    const newClass = await prisma.class.create({
      data: {
        name: name.trim(),
        section: section?.trim() || null,
        capacity: capacity ? parseInt(capacity) : null,
        tenantId: tenant.id,
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A class with this name already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
