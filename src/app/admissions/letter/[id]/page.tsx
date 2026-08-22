import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function AdmissionLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const application = await prisma.admissionApplication.findUnique({
    where: { id },
    include: { tenant: true }
  })

  if (!application) return notFound()

  // Generate admission number if accepted, or just a placeholder if viewing before acceptance
  // We'll show the actual admission number if the student profile exists
  // For now, if accepted, we can fetch the student profile by email or just show generic
  
  const schoolName = application.tenant?.name || "Starlight Model School"
  const schoolAddress = application.tenant?.address || "123 Education Way, Knowledge City"
  const schoolPhone = application.tenant?.phone || "+234 805 680 9200"
  
  return (
    <div className="min-h-screen bg-gray-100 print:bg-white flex items-center justify-center p-4 print:p-0">
      <div className="bg-white w-full max-w-4xl min-h-[1056px] shadow-2xl print:shadow-none p-12 sm:p-20 relative">
        
        {/* Controls - Hidden when printing */}
        <div className="absolute top-4 right-4 flex gap-3 print:hidden">
          <Link href={`/admissions/status?id=${id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm">
            ← Back
          </Link>
          <button onClick={() => { typeof window !== 'undefined' && window.print() }} className="px-4 py-2 bg-[#000080] text-white font-bold rounded-lg text-sm flex items-center gap-2 shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Letter
          </button>
        </div>

        {/* Letterhead */}
        <div className="flex justify-between items-center border-b-4 border-[#000080] pb-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#000080] rounded-full flex items-center justify-center shadow-lg">
              {application.tenant?.logoUrl ? (
                <Image src={application.tenant.logoUrl} alt="Logo" width={80} height={80} className="rounded-full" />
              ) : (
                <span className="text-white text-3xl font-black">SMS</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#000080] tracking-tight uppercase">{schoolName}</h1>
              <p className="text-gray-600 mt-1">{schoolAddress}</p>
              <p className="text-gray-600">{schoolPhone}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold text-gray-800">REF: SMS/ADM/${new Date().getFullYear()}/${id.substring(0, 4).toUpperCase()}</p>
            <p className="text-gray-500 mt-1">Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Recipient */}
        <div className="mb-12">
          <p className="text-gray-800">To: <strong>{application.parentName}</strong></p>
          <p className="text-gray-800">{application.homeAddress}</p>
        </div>

        {/* Subject */}
        <h2 className="text-xl font-black text-center uppercase underline mb-10 tracking-wider text-gray-900">
          Provisional Offer of Admission
        </h2>

        {/* Body */}
        <div className="space-y-6 text-gray-800 leading-relaxed text-justify">
          <p>Dear {application.parentName},</p>
          
          <p>
            Following the successful review of your application, we are pleased to offer your ward, 
            <strong className="text-lg"> {application.firstName} {application.lastName}</strong>, 
            provisional admission into <strong className="text-lg">{application.classApplyingFor}</strong> at {schoolName} for the upcoming academic session.
          </p>

          <p>
            This offer is subject to your acceptance of the terms and conditions outlined in the school's prospectus, and the prompt payment of all stipulated school fees. 
            Failure to complete the registration process within two (2) weeks of receiving this letter may lead to forfeiture of the admission.
          </p>

          <p>Please bring this letter, along with the original copies of all uploaded documents, to the school administrative office to complete the final enrollment process.</p>

          <p>We look forward to welcoming {application.firstName} to our vibrant learning community and to a fruitful partnership with you.</p>

          <p>Once again, congratulations.</p>
        </div>

        {/* Signatures */}
        <div className="mt-24 pt-12 flex justify-between">
          <div className="text-center">
            <div className="w-48 border-b border-gray-400 mb-2 h-10"></div>
            <p className="font-bold text-gray-800">Admissions Officer</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-gray-400 mb-2 h-10 relative">
              {/* Optional: Add a signature image here */}
            </div>
            <p className="font-bold text-gray-800">Principal</p>
            <p className="text-xs text-gray-500">{schoolName}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <div className="w-2/3 mx-auto border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400 font-medium">Excellence in Education • Building the Future</p>
            <p className="text-[10px] text-gray-400 mt-1">This is an auto-generated document. Ensure to keep it safe.</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}
