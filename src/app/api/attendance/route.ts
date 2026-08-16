import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get("mode")
    const classId = searchParams.get("classId")

    // ── Summary mode ──────────────────────────────────────────────────────────
    if (mode === "summary") {
      const startDate = searchParams.get("startDate")
      const endDate = searchParams.get("endDate")

      if (!classId || !startDate || !endDate) {
        return NextResponse.json(
          { error: "Missing classId, startDate, or endDate" },
          { status: 400 }
        )
      }

      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)

      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      // Fetch all students in the class
      const students = await prisma.studentProfile.findMany({
        where: { classId },
        include: {
          user: { select: { name: true } },
          attendances: {
            where: {
              date: { gte: start, lte: end },
            },
            select: { status: true },
          },
        },
        orderBy: { admissionNumber: "asc" },
      })

      const summary = students.map((s) => {
        const present = s.attendances.filter((a) => a.status === "PRESENT").length
        const absent = s.attendances.filter((a) => a.status === "ABSENT").length
        const late = s.attendances.filter((a) => a.status === "LATE").length
        const totalDays = present + absent + late
        const percentage = totalDays === 0 ? 0 : Math.round(((present + late) / totalDays) * 100)

        return {
          studentId: s.id,
          name: s.user.name,
          admissionNumber: s.admissionNumber,
          totalDays,
          present,
          absent,
          late,
          percentage,
        }
      })

      return NextResponse.json(summary)
    }

    // ── Default mode: fetch attendance for a single date ───────────────────────
    const dateStr = searchParams.get("date")

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
    const { studentId, status, date, classId, markedBy } = body

    if (!studentId || !status || !date || !classId || !markedBy) {
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
        data: { status, markedBy }
      })
    } else {
      record = await prisma.attendance.create({
        data: {
          studentId,
          classId,
          status,
          markedBy,
          date: new Date(date),
        }
      })
    }
    
    return NextResponse.json(record)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
