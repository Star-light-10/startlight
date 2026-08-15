import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Application ID is required", { status: 400 });
    }

    const app = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!app || app.status !== "ACCEPTED" || !app.hasPaidFee) {
      return new NextResponse("Admission Letter not available or unauthorized.", { status: 403 });
    }

    // Generate HTML for printable letter
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admission Letter - ${app.firstName} ${app.lastName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; max-w: 800px; margin: 0 auto; padding: 40px; color: #000; }
          .header { text-align: center; border-bottom: 2px solid #000080; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { max-width: 100px; margin-bottom: 10px; }
          .school-name { color: #000080; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; }
          .school-contact { font-size: 14px; margin-top: 5px; }
          .date { text-align: right; margin-bottom: 30px; font-weight: bold; }
          .recipient { margin-bottom: 30px; }
          .title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 30px; text-transform: uppercase; }
          .content { text-align: justify; margin-bottom: 40px; font-size: 16px; }
          .signature { margin-top: 60px; }
          .print-btn { display: block; width: 200px; margin: 40px auto; padding: 10px; text-align: center; background: #000080; color: white; text-decoration: none; border-radius: 5px; cursor: pointer; font-family: sans-serif; font-weight: bold; }
          @media print { .print-btn { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="school-name">Starlight Model School</h1>
          <div class="school-contact">123 Education Avenue, Knowledge City</div>
          <div class="school-contact">Tel: +234 805 680 9200 | Email: admin@starlightms.com</div>
        </div>

        <div class="date">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>

        <div class="recipient">
          To the Parent/Guardian of:<br/>
          <strong>${app.firstName} ${app.middleName || ''} ${app.lastName}</strong><br/>
          ${app.homeAddress}
        </div>

        <div class="title">OFFICIAL PROVISIONAL ADMISSION LETTER</div>

        <div class="content">
          <p>Dear ${app.parentName},</p>
          <p>Following the successful review of your application and the confirmation of your application fee payment (Ref: ${app.id}), we are pleased to offer <strong>${app.firstName} ${app.lastName}</strong> provisional admission into <strong>${app.classApplyingFor}</strong> for the 2026/2027 Academic Session.</p>
          <p>This admission is offered based on the information provided in your application. Please note that it remains provisional until all required physical documents are verified and termly school fees are paid in full.</p>
          <p>You are required to visit the school administration office within the next two weeks with the following documents for documentation and collection of the official prospectus:</p>
          <ul>
            <li>Two (2) recent passport photographs</li>
            <li>Birth Certificate or Declaration of Age</li>
            <li>Last academic report from previous school (if applicable)</li>
            <li>Medical Fitness Certificate</li>
          </ul>
          <p>Congratulations on becoming part of the Starlight family. We look forward to a rewarding academic journey with your child.</p>
        </div>

        <div class="signature">
          <p>Yours faithfully,</p>
          <p><strong>Principal / Admissions Officer</strong><br/>Starlight Model School</p>
        </div>

        <button class="print-btn" onclick="window.print()">🖨️ Print Letter</button>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      }
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse("Failed to generate letter", { status: 500 });
  }
}
