import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/db"

/**
 * GET /api/student/results
 *
 * Returns the logged-in student's report card for the active term.
 * Optionally accepts ?termId=... to fetch a specific term.
 */
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Look up this user's student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const termIdParam = searchParams.get("termId")

    // Resolve the term to query
    let termId: string | null = termIdParam

    if (!termId) {
      // Default to active term
      const activeTerm = await prisma.academicTerm.findFirst({
        where: { isActive: true },
        orderBy: { startDate: "desc" },
      })
      termId = activeTerm?.id ?? null
    }

    if (!termId) {
      // No active term — return empty result with list of available terms
      const terms = await prisma.academicTerm.findMany({
        orderBy: { startDate: "desc" },
        take: 5,
      })
      return NextResponse.json({ reportCard: null, terms })
    }

    // Fetch the report card
    const reportCard = await prisma.reportCard.findUnique({
      where: {
        studentId_termId: {
          studentId: profile.id,
          termId,
        },
      },
      include: {
        term: true,
        grades: {
          include: { subject: true },
          orderBy: { subject: { name: "asc" } },
        },
      },
    })

    // Fetch all terms that have a report card for this student (for term selector)
    const terms = await prisma.academicTerm.findMany({
      where: {
        reportCards: {
          some: { studentId: profile.id },
        },
      },
      orderBy: { startDate: "desc" },
    })

    return NextResponse.json({ reportCard, terms, currentTermId: termId })
  } catch (error: any) {
    console.error("[GET /api/student/results]", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
