import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "dummy")

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action } = await request.json()
    const { id: applicationId } = await params

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

    if (action === "VERIFY_FEE") {
      const updated = await prisma.admissionApplication.update({
        where: { id: applicationId },
        data: { hasPaidFee: true },
      })
      return NextResponse.json(updated)
    }

    if (action === "ACCEPT") {
      let plainPassword = ""
      let uniqueEmail = ""
      let admissionNumber = ""

      // Begin transaction to accept and enroll
      const result = await prisma.$transaction(async (tx) => {
        // 1. Mark as accepted
        const updatedApp = await tx.admissionApplication.update({
          where: { id: applicationId },
          data: { status: "ACCEPTED" },
        })

        let effectiveTenantId = updatedApp.tenantId
        if (!effectiveTenantId) {
          const fallback = await tx.tenant.findFirst()
          if (!fallback) throw new Error("System not initialized. No tenant found.")
          effectiveTenantId = fallback.id
        }

        // 2. Find or create target class
        // The application classApplyingFor contains the class name, e.g. "JSS 1"
        let targetClass = await tx.class.findFirst({
          where: { 
            name: updatedApp.classApplyingFor,
            tenantId: effectiveTenantId
          },
        })

        if (!targetClass) {
          // Auto-create the class if it doesn't exist yet
          targetClass = await tx.class.create({
            data: {
              name: updatedApp.classApplyingFor,
              tenantId: effectiveTenantId
            }
          })
        }

        // 3. Generate Admission Number (e.g. SMS/26/0001)
        const count = await tx.studentProfile.count()
        admissionNumber = `SMS/26/${String(count + 1).padStart(4, '0')}`

        // 4. Create User
        // Use a dummy email if parent didn't provide one, or unique one
        uniqueEmail = updatedApp.parentEmail || `student_${admissionNumber.replace(/\//g, '')}@starlight.edu.ng`
        
        plainPassword = Math.random().toString(36).slice(-8) + "!";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newUser = await tx.user.create({
          data: {
            name: `${updatedApp.firstName} ${updatedApp.lastName}`,
            email: uniqueEmail.toLowerCase(),
            password: hashedPassword,
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

      // 6. Send Email Notification
      if (process.env.RESEND_API_KEY && application.parentEmail) {
        try {
          await resend.emails.send({
            from: "Starlight Admissions <admissions@starlight.edu.ng>",
            to: application.parentEmail,
            subject: "Admission Accepted - Starlight Model School",
            html: `
              <h2>Congratulations!</h2>
              <p>Dear ${application.parentName},</p>
              <p>We are pleased to inform you that <strong>${application.firstName} ${application.lastName}</strong> has been admitted into <strong>${application.classApplyingFor}</strong> at Starlight Model School.</p>
              <p>Here are your student login credentials:</p>
              <ul>
                <li><strong>Admission Number:</strong> ${admissionNumber}</li>
                <li><strong>Portal Email:</strong> ${uniqueEmail}</li>
                <li><strong>Temporary Password:</strong> ${plainPassword}</li>
              </ul>
              <p>Please log in to the student portal to download the official admission letter and update your password.</p>
              <br>
              <p>Best regards,<br>Starlight Model School Management</p>
            `,
          })
        } catch (emailError) {
          console.error("Failed to send email:", emailError)
          // We don't fail the request if email fails, just log it.
        }
      } else {
        console.log("Simulating email send (No API Key or Parent Email provided):", { uniqueEmail, plainPassword, admissionNumber })
      }

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || "Failed to process application" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if the application exists and is not accepted
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status === "ACCEPTED") {
      return NextResponse.json({ error: "Cannot delete an application that has already been accepted and enrolled." }, { status: 400 });
    }

    await prisma.admissionApplication.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if the application exists
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status === "ACCEPTED") {
      return NextResponse.json({ error: "Cannot edit an application that has already been accepted and enrolled." }, { status: 400 });
    }

    // Update the application
    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        religion: data.religion,
        homeAddress: data.homeAddress,
        classApplyingFor: data.classApplyingFor,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        parentOccupation: data.parentOccupation,
        ...(data.status && { status: data.status })
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

