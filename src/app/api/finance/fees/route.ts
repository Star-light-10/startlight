import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const fees = await prisma.feeStructure.findMany({
      include: {
        class: true,
        term: true
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(fees)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fee structures" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, description, amount, classId, termId } = data
    
    if (!name || !amount || !classId || !termId) {
      return NextResponse.json({ error: "Name, amount, class, and term are required" }, { status: 400 })
    }

    const fee = await prisma.feeStructure.create({
      data: {
        name,
        description,
        amount: parseFloat(amount),
        classId,
        termId,
      },
      include: {
        class: true,
        term: true
      }
    })
    
    return NextResponse.json(fee, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A fee structure with this name already exists for this class and term." }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create fee structure" }, { status: 500 })
  }
}
