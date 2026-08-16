import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeGrade(total: number): { gradeLetter: string; remarks: string } {
  if (total >= 70) return { gradeLetter: "A", remarks: "Excellent" }
  if (total >= 60) return { gradeLetter: "B", remarks: "Very Good" }
  if (total >= 50) return { gradeLetter: "C", remarks: "Good" }
  if (total >= 40) return { gradeLetter: "D", remarks: "Pass" }
  return { gradeLetter: "F", remarks: "Fail" }
}

// ─── GET ──────────────────────────────────────────────────────────────────────
// ?classId=&termId=  → all report cards for that class + term
// ?studentId=&termId= → single student's report card

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("classId")
    const termId = searchParams.get("termId")
    const studentId = searchParams.get("studentId")

    // Single student
    if (studentId && termId) {
      const card = await prisma.reportCard.findUnique({
        where: { studentId_termId: { studentId, termId } },
        include: {
          student: {
            include: {
              user: true,
              class: true,
            },
          },
          term: true,
          grades: {
            include: { subject: true },
            orderBy: { subject: { name: "asc" } },
          },
        },
      })

      if (!card) {
        return NextResponse.json({ error: "Report card not found" }, { status: 404 })
      }
      return NextResponse.json(card)
    }

    // All students in a class for a term
    if (classId && termId) {
      // Get all students in the class
      const students = await prisma.studentProfile.findMany({
        where: { classId },
        include: { user: true, class: true },
        orderBy: { admissionNumber: "asc" },
      })

      // Get all report cards for that term for those students
      const studentIds = students.map((s) => s.id)
      const cards = await prisma.reportCard.findMany({
        where: { termId, studentId: { in: studentIds } },
        include: {
          student: {
            include: { user: true, class: true },
          },
          term: true,
          grades: {
            include: { subject: true },
            orderBy: { subject: { name: "asc" } },
          },
        },
      })

      return NextResponse.json(cards)
    }

    return NextResponse.json(
      { error: "Provide (classId + termId) or (studentId + termId)" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("[GET /api/results]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
// Body: { studentId, termId, grades: [{subjectId, caScore, examScore}], principalRemarks? }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, termId, grades, principalRemarks } = body

    if (!studentId || !termId || !Array.isArray(grades)) {
      return NextResponse.json(
        { error: "studentId, termId, and grades[] are required" },
        { status: 400 }
      )
    }

    // Upsert the ReportCard
    const reportCard = await prisma.reportCard.upsert({
      where: { studentId_termId: { studentId, termId } },
      create: {
        studentId,
        termId,
        principalRemarks: principalRemarks ?? null,
      },
      update: {
        principalRemarks: principalRemarks ?? undefined,
      },
    })

    // Upsert each grade
    let totalSum = 0
    let gradeCount = 0

    for (const g of grades) {
      const { subjectId, caScore, examScore } = g
      const ca = Math.max(0, Math.min(30, Number(caScore) || 0))
      const exam = Math.max(0, Math.min(70, Number(examScore) || 0))
      const total = ca + exam
      const { gradeLetter, remarks } = computeGrade(total)

      await prisma.grade.upsert({
        where: {
          reportCardId_subjectId: {
            reportCardId: reportCard.id,
            subjectId,
          },
        },
        create: {
          reportCardId: reportCard.id,
          subjectId,
          caScore: ca,
          examScore: exam,
          totalScore: total,
          gradeLetter,
          remarks,
        },
        update: {
          caScore: ca,
          examScore: exam,
          totalScore: total,
          gradeLetter,
          remarks,
        },
      })

      totalSum += total
      gradeCount++
    }

    // Compute and save average back to the report card
    const average = gradeCount > 0 ? totalSum / gradeCount : 0

    const updatedCard = await prisma.reportCard.update({
      where: { id: reportCard.id },
      data: {
        totalScore: totalSum,
        average: parseFloat(average.toFixed(2)),
      },
      include: {
        student: {
          include: { user: true, class: true },
        },
        term: true,
        grades: {
          include: { subject: true },
          orderBy: { subject: { name: "asc" } },
        },
      },
    })

    return NextResponse.json(updatedCard, { status: 200 })
  } catch (error: any) {
    console.error("[POST /api/results]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
