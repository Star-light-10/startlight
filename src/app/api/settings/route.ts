import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/settings — fetch school (tenant) info
export async function GET() {
  try {
    const tenant = await prisma.tenant.findFirst()
    return NextResponse.json(tenant || {})
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/settings — update school info
export async function PATCH(request: NextRequest) {
  try {
    const { name, address, phone, email, domain } = await request.json()

    let tenant = await prisma.tenant.findFirst()
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { name: name || "Starlight Model School" }
      })
    }

    const updated = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(domain !== undefined ? { domain } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
