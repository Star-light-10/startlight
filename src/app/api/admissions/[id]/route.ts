import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    const applicationId = params.id

    const application = await prisma.admissionApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    if (action === "REJECT") {
      const updated = await prisma.admissionApplication.update({
        where: { id: applicationId },
        data: { status: "REJECTED" },
      })
      return NextResponse.json(updated)
    }

    if (action === "ACCEPT") {
      // Begin transaction to accept and enroll
      const result = await prisma.$transaction(async (tx) => {
        // 1. Mark as accepted
        const updatedApp = await tx.admissionApplication.update({
          where: { id: applicationId },
          data: { status: "ACCEPTED" },
        })

        // 2. Find target class ID
        // The application classApplyingFor contains the class name, e.g. "JSS 1"
        const targetClass = await tx.class.findFirst({
          where: { 
            name: updatedApp.classApplyingFor,
            tenantId: updatedApp.tenantId || undefined
          },
        })

        if (!targetClass) {
          throw new Error(`Class '${updatedApp.classApplyingFor}' does not exist. Create it first.`)
        }

        // 3. Generate Admission Number (e.g. SMS/26/0001)
        const count = await tx.studentProfile.count()
        const admissionNumber = `SMS/26/${String(count + 1).padStart(4, '0')}`

        // 4. Create User
        // Use a dummy email if parent didn't provide one, or unique one
        const uniqueEmail = updatedApp.parentEmail || `student_${admissionNumber.replace(/\//g, '')}@starlight.edu.ng`
        
        const newUser = await tx.user.create({
          data: {
            name: `${updatedApp.firstName} ${updatedApp.lastName}`,
            email: uniqueEmail.toLowerCase(),
            role: "STUDENT",
            tenantId: updatedApp.tenantId,
            image: updatedApp.passportPhotoUrl
          }
        })

        // 5. Create StudentProfile
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            admissionNumber,
            classId: targetClass.id,
          }
        })

        return updatedApp
      })

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || "Failed to process application" }, { status: 500 })
  }
}
