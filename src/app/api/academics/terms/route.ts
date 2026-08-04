import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const terms = await prisma.academicTerm.findMany({
      orderBy: { startDate: "desc" },
    })
    return NextResponse.json(terms)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch terms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, startDate, endDate, isActive, tenantId } = data
    
    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Name, start date, and end date are required" }, { status: 400 })
    }
    
    const actualTenantId = tenantId || (await prisma.tenant.findFirst())?.id
    if (!actualTenantId) {
       return NextResponse.json({ error: "No tenant found" }, { status: 400 })
    }

    // If making this active, deactivate others
    if (isActive) {
      await prisma.academicTerm.updateMany({
        where: { tenantId: actualTenantId, isActive: true },
        data: { isActive: false }
      })
    }

    const newTerm = await prisma.academicTerm.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive || false,
        tenantId: actualTenantId,
      },
    })
    
    return NextResponse.json(newTerm, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create academic term" }, { status: 500 })
  }
}
