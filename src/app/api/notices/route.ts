import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { auth } from "@/auth"

export async function GET() {
  try {
    const notices = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(notices)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { title, content, audience } = body

    if (!title || !content || !audience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get or create a system user ID for the announcement author
    let authorId = session?.user?.id
    if (!authorId) {
      // Fallback: find any admin user to use as author
      const adminUser = await prisma.user.findFirst({
        where: { role: { in: ["SUPER_ADMIN", "SCHOOL_OWNER", "PRINCIPAL"] } }
      })
      authorId = adminUser?.id
    }

    if (!authorId) {
      return NextResponse.json({ error: "Could not determine author. Please log in." }, { status: 401 })
    }

    const notice = await prisma.announcement.create({
      data: {
        title,
        content,
        audience,
        authorId,
      },
    })
    
    return NextResponse.json(notice)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    await prisma.announcement.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
