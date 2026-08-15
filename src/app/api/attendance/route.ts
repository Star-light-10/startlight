import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get("date")
    const classId = searchParams.get("classId")

    if (!dateStr || !classId) {
      return NextResponse.json({ error: "Missing date or classId" }, { status: 400 })
    }

    const startOfDay = new Date(dateStr)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(dateStr)
    endOfDay.setHours(23, 59, 59, 999)

    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        student: {
          classId
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    })

    return NextResponse.json(attendance)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentId, status, date } = body

    if (!studentId || !status || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if record exists for this date and student
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        }
      }
    })

    let record;
    
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status }
      })
    } else {
      record = await prisma.attendance.create({
        data: {
          studentId,
          status,
          date: new Date(date),
          term: "FIRST_TERM", // Hardcoded for MVP, should be dynamic
          session: "2026/2027" // Hardcoded for MVP
        }
      })
    }
    
    return NextResponse.json(record)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
