import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

const CLOUDINARY_CLOUD_NAME = "jat0mm5x"
const CLOUDINARY_UPLOAD_PRESET = "starlight_passports"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract fields
    const firstName = formData.get("firstName") as string
    const middleName = (formData.get("middleName") as string) || undefined
    const lastName = formData.get("lastName") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const gender = formData.get("gender") as string
    const religion = formData.get("religion") as string
    const homeAddress = formData.get("homeAddress") as string
    const classApplyingFor = formData.get("classApplyingFor") as string
    const parentName = formData.get("parentName") as string
    const parentPhone = formData.get("parentPhone") as string
    const parentEmail = (formData.get("parentEmail") as string) || undefined
    const parentOccupation = (formData.get("parentOccupation") as string) || undefined
    const passportFile = formData.get("passport") as File | null
    const passportPhotoUrl = (formData.get("passportPhotoUrl") as string) || undefined

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !homeAddress || !classApplyingFor || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // Use the Cloudinary URL sent from client-side upload
    // Fallback: if a file was sent directly, upload it server-side
    let finalPhotoUrl = passportPhotoUrl

    if (!finalPhotoUrl && passportFile && passportFile.size > 0) {
      if (passportFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Passport photo must be less than 5MB." },
          { status: 400 }
        )
      }

      const cloudinaryForm = new FormData()
      cloudinaryForm.append("file", passportFile)
      cloudinaryForm.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      cloudinaryForm.append("folder", "starlight_passports")

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudinaryForm }
      )

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json()
        finalPhotoUrl = cloudData.secure_url
      }
    }

    // Save to database
    const application = await prisma.admissionApplication.create({
      data: {
        firstName,
        middleName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        religion: religion || "Islam",
        homeAddress,
        classApplyingFor,
        passportPhotoUrl: finalPhotoUrl,
        parentName,
        parentPhone,
        parentEmail,
        parentOccupation,
      },
    })

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        applicationId: application.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Admission API error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}

// GET: Fetch all applications (admin use)
export async function GET() {
  try {
    const applications = await prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error("Fetch applications error:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    )
  }
}
