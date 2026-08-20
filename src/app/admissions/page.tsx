"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { StarlightLogo } from "@/components/starlight-logo"

const STORAGE_KEY = "starlight_admission_form"

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] transition"

const labelClass =
  "block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5"

function SectionHeader({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-[#000080] text-white flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function AdmissionsPage() {
  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [applicantDetails, setApplicantDetails] = useState({
    name: "",
    phone: "",
    address: "",
    className: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Restore saved form data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && formRef.current) {
        const data = JSON.parse(saved)
        const form = formRef.current
        Object.entries(data).forEach(([key, value]) => {
          const el = form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
          if (el && typeof value === "string") el.value = value
        })
        if (data._passportPreview) setPassportPreview(data._passportPreview)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const saveProgress = useCallback(() => {
    if (!formRef.current) return
    const form = formRef.current
    const formData = new FormData(form)
    const data: Record<string, string> = {}
    formData.forEach((val, key) => {
      if (typeof val === "string") data[key] = val
    })
    if (passportPreview) data._passportPreview = passportPreview
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [passportPreview])

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPG, PNG)")
        return
      }
      setPassportFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPassportPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      if (passportFile) {
        formData.append("passport", passportFile)
      }

      const res = await fetch("/api/admissions", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || "Submission failed. Please try again.")
        return
      }

      // Capture applicant details before clearing form
      const form = e.currentTarget
      const fd = new FormData(form)
      const firstName = (fd.get("firstName") as string) || ""
      const middleName = (fd.get("middleName") as string) || ""
      const lastName = (fd.get("lastName") as string) || ""
      setApplicantDetails({
        name: [firstName, middleName, lastName].filter(Boolean).join(" "),
        phone: (fd.get("parentPhone") as string) || "",
        address: (fd.get("homeAddress") as string) || "",
        className: (fd.get("classApplyingFor") as string) || "",
      })

      setApplicationId(data.applicationId)
      localStorage.removeItem(STORAGE_KEY)
      setIsSuccess(true)
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (isSuccess) {
    const whatsappMessage = encodeURIComponent(
      `Hello Admin,\n\nI have just paid the ₦2,000 Admission Application Fee.\n\n` +
      `*Applicant Details:*\n` +
      `• Name: ${applicantDetails.name}\n` +
      `• Class Applying For: ${applicantDetails.className}\n` +
      `• Home Address: ${applicantDetails.address}\n` +
      `• Parent/Guardian Phone: ${applicantDetails.phone}\n\n` +
      `*Application ID:* ${applicationId}\n\n` +
      `Please find my payment receipt attached. Kindly process my application. Thank you.`
    );
    const whatsappUrl = `https://wa.me/2348056809200?text=${whatsappMessage}`;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-lg mx-auto border border-gray-100 dark:border-gray-800">
          
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
            Your admission application has been received. To complete your application, please pay the application fee.
          </p>

          {/* Application ID Box */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 font-bold">Your Application ID</p>
            <p className="text-2xl font-mono font-black text-[#000080] dark:text-[#FFA500] tracking-wider">{applicationId}</p>
            <p className="text-[10px] text-gray-400 mt-2">Save this ID! You will need it to check your status and download your letter.</p>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-900/30">
            <h3 className="font-bold text-[#000080] dark:text-blue-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Instructions
            </h3>
            
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold text-gray-900 dark:text-white">₦2,000</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                <span className="text-gray-500">Bank:</span>
                <span className="font-bold text-gray-900 dark:text-white">FIRST BANK</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-2">
                <span className="text-gray-500">Account Number:</span>
                <span className="font-bold text-gray-900 dark:text-white tracking-wider">3056744562</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Account Name:</span>
                <span className="font-bold text-gray-900 dark:text-white">YAKUB KHADIJAT TITILOPE</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              I Have Paid - Send Receipt
            </a>
            
            <Link
              href="/admissions/status"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
            >
              Check Application Status →
            </Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            For other details, contact the school at <strong>+234 805 680 9200</strong>
          </p>
        </div>
      </div>
    )
  }

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <StarlightLogo className="w-9 h-9" />
              <div>
                <p className="font-black text-[#000080] dark:text-white text-xs">STARLIGHT MODEL SCHOOL</p>
                <p className="text-[9px] text-[#FFA500] font-semibold tracking-widest">Admissions Portal</p>
              </div>
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#000080] to-[#4169E1] py-12 text-center text-white">
        <h1 className="text-3xl font-black mb-2">Admission Application</h1>
        <p className="text-blue-200 text-sm">2026/2027 Academic Session • Nursery, Primary, JSS &amp; SSS</p>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">

          {/* Form intro */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 px-8 py-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Please fill in all required fields marked with <span className="font-bold">*</span>. Your progress is saved automatically.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-8 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
              ⚠ {errorMessage}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} onChange={saveProgress} className="px-8 py-8 space-y-10">

            {/* ── Section 1: Passport Photo ── */}
            <div>
              <SectionHeader number={1} title="Passport Photograph" subtitle="Upload a clear, recent passport-sized photo of the applicant." />
              <div className="flex flex-col items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="passport-upload"
                  onChange={handlePassportUpload}
                />
                <label htmlFor="passport-upload" className="block cursor-pointer">
                  {passportPreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#000080] shadow-lg group">
                      <Image src={passportPreview} alt="Passport preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center hover:border-[#000080] hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
                      <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 text-center px-2 font-medium">Upload Photo</span>
                    </div>
                  )}
                </label>
                {passportPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPassportPreview(null)
                      setPassportFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    Remove photo
                  </button>
                )}
                <p className="text-xs text-gray-400">JPG, PNG or WEBP • Max 2MB</p>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ── Section 2: Personal Information ── */}
            <div>
              <SectionHeader number={2} title="Personal Information" subtitle="Enter the applicant's biodata exactly as it appears on official documents." />
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input name="firstName" type="text" required className={inputClass} placeholder="e.g. Aisha" />
                  </div>
                  <div>
                    <label className={labelClass}>Middle Name</label>
                    <input name="middleName" type="text" className={inputClass} placeholder="e.g. Nafisat" />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input name="lastName" type="text" required className={inputClass} placeholder="e.g. Abdullahi" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input name="dateOfBirth" type="date" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" required className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Religion</label>
                    <select name="religion" defaultValue="Islam" className={inputClass}>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Home Address *</label>
                  <textarea name="homeAddress" rows={2} required className={`${inputClass} resize-none`} placeholder="Full residential address" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Class Applying For *</label>
                    <select name="classApplyingFor" required className={inputClass}>
                      <option value="">Select Class</option>
                      <optgroup label="Nursery">
                        <option>Nursery 1</option>
                        <option>Nursery 2</option>
                      </optgroup>
                      <optgroup label="Primary">
                        <option>Primary 1</option>
                        <option>Primary 2</option>
                        <option>Primary 3</option>
                        <option>Primary 4</option>
                        <option>Primary 5</option>
                        <option>Primary 6</option>
                      </optgroup>
                      <optgroup label="Junior Secondary">
                        <option>JSS 1</option>
                        <option>JSS 2</option>
                        <option>JSS 3</option>
                      </optgroup>
                      <optgroup label="Senior Secondary">
                        <option>SSS 1</option>
                        <option>SSS 2</option>
                        <option>SSS 3</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>State of Origin</label>
                    <input name="stateOfOrigin" type="text" className={inputClass} placeholder="e.g. Oyo State" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ── Section 3: Parent / Guardian ── */}
            <div>
              <SectionHeader number={3} title="Parent / Guardian Information" subtitle="Provide the contact details of the applicant's parent or guardian." />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input name="parentName" type="text" required className={inputClass} placeholder="Parent or guardian full name" />
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input name="parentPhone" type="tel" required className={inputClass} placeholder="08012345678" />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input name="parentEmail" type="email" className={inputClass} placeholder="parent@email.com" />
                </div>
                <div>
                  <label className={labelClass}>Occupation</label>
                  <input name="parentOccupation" type="text" className={inputClass} placeholder="e.g. Civil Servant" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Relationship to Applicant</label>
                  <select name="parentRelationship" className={inputClass}>
                    <option value="">Select relationship</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ── Section 4: Academic History ── */}
            <div>
              <SectionHeader number={4} title="Academic History" subtitle="Details about the applicant's previous school (if applicable)." />
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Previous School Name</label>
                  <input name="previousSchool" type="text" className={inputClass} placeholder="Name of last school attended" />
                </div>
                <div>
                  <label className={labelClass}>Last Class Attended</label>
                  <input name="lastClassAttended" type="text" className={inputClass} placeholder="e.g. Primary 4" />
                </div>
                <div>
                  <label className={labelClass}>Year Left</label>
                  <input name="yearLeft" type="text" className={inputClass} placeholder="e.g. 2025" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Reason for Leaving</label>
                  <textarea name="reasonForLeaving" rows={2} className={`${inputClass} resize-none`} placeholder="Optional" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* ── Section 5: Additional Notes ── */}
            <div>
              <SectionHeader number={5} title="Additional Information" subtitle="Any special needs, medical conditions, or other notes we should know about." />
              <textarea name="additionalNotes" rows={3} className={`${inputClass} resize-none`} placeholder="e.g. dietary restrictions, health conditions, special learning needs..." />
            </div>

            {/* ── Declaration & Submit ── */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                By submitting this form, I confirm that all information provided is accurate and true to the best of my knowledge. I understand that providing false information may result in the rejection of this application.
              </p>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                  ← Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-[#000080] hover:bg-[#000066] disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors shadow-lg flex items-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
