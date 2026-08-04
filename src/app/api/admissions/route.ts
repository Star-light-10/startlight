import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { supabaseAdmin } from "@/lib/supabase-admin"

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

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !homeAddress || !classApplyingFor || !parentName || !parentPhone) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // Upload passport photo to Supabase Storage
    let passportPhotoUrl: string | undefined

    if (passportFile && passportFile.size > 0) {
      // Validate file
      if (passportFile.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Passport photo must be less than 2MB." },
          { status: 400 }
        )
      }

      if (!passportFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Passport photo must be an image file." },
          { status: 400 }
        )
      }

      const fileExt = passportFile.name.split(".").pop() || "jpg"
      const fileName = `${Date.now()}_${firstName}_${lastName}.${fileExt}`

      const arrayBuffer = await passportFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabaseAdmin.storage
        .from("passports")
        .upload(fileName, buffer, {
          contentType: passportFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return NextResponse.json(
          { error: "Failed to upload passport photo. Please try again." },
          { status: 500 }
        )
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("passports")
        .getPublicUrl(fileName)

      passportPhotoUrl = publicUrlData.publicUrl
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
        passportPhotoUrl,
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
