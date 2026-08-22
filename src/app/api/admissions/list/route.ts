import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const paginate = searchParams.get("paginate") !== "false"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    const statusFilter = searchParams.get("status") || "ALL"
    
    const skip = (page - 1) * limit
    const where: any = {}
    
    if (statusFilter !== "ALL") {
      where.status = statusFilter
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { parentPhone: { contains: search, mode: "insensitive" } },
        { classApplyingFor: { contains: search, mode: "insensitive" } }
      ]
    }

    if (!paginate) {
      const applications = await prisma.admissionApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(applications)
    }

    const [applications, total] = await Promise.all([
      prisma.admissionApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.admissionApplication.count({ where })
    ])

    return NextResponse.json({
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
