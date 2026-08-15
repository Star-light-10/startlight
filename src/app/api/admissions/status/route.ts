import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const application = await prisma.admissionApplication.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        classApplyingFor: true,
        status: true,
        hasPaidFee: true,
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found. Please check your ID." }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch application status" }, { status: 500 });
  }
}
