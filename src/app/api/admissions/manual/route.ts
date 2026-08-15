import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Basic validation
    if (!data.firstName || !data.lastName || !data.classApplyingFor || !data.parentName || !data.parentPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newApplication = await prisma.admissionApplication.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName || "",
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        religion: data.religion,
        homeAddress: data.homeAddress,
        classApplyingFor: data.classApplyingFor,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail || "",
        parentOccupation: data.parentOccupation || "",
        status: data.status || "PENDING",
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}
