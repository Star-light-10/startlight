import { NextResponse } from "next/server"
import prisma from "@/lib/db"

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
    const body = await req.json()
    const { title, content, audience } = body

    if (!title || !content || !audience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const notice = await prisma.announcement.create({
      data: {
        title,
        content,
        audience,
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
