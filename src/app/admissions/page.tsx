"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { StarlightLogo } from "@/components/starlight-logo"

export default function AdmissionsPage() {
  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const reader = new FileReader()
      reader.onloadend = () => {
        setPassportPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="bg-gradient-to-r from-[#000080] to-[#4169E1] py-16 text-center text-white">
        <h1 className="text-4xl font-black mb-3">Admission Application</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          2025/2026 Academic Session • Nursery, Primary, JSS &amp; SSS
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-0 mb-12">
          {["Personal Info", "Academic History", "Documents", "Payment", "Submit"].map((step, i, arr) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? "bg-[#000080] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                  {i + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 hidden sm:block">{step}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px w-12 sm:w-16 mx-1 ${i === 0 ? "bg-[#000080]" : "bg-gray-200 dark:bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Application Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Personal Information</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Please fill in the applicant&apos;s correct details. Fields marked * are required.
          </p>

          <form className="space-y-6">
            {/* Passport Photo Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="passport-upload"
                  onChange={handlePassportUpload}
                />
                <label
                  htmlFor="passport-upload"
                  className="block cursor-pointer"
                >
                  {passportPreview ? (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#000080] shadow-lg group">
                      <Image
                        src={passportPreview}
                        alt="Passport preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 border-4 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center hover:border-[#000080] hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
                      <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 text-center px-2 font-medium">Upload Passport</span>
                    </div>
                  )}
                </label>
                {passportPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPassportPreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 shadow-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">First Name *</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="e.g. Adaeze" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Middle Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="e.g. Chioma" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Last Name *</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="e.g. Okafor" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Date of Birth *</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Gender *</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Class Applying For *</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]">
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
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Religion</label>
                <select defaultValue="Islam" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]">
                  <option value="Islam">Islam</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Home Address *</label>
              <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none" placeholder="Full residential address" />
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="font-black text-gray-900 dark:text-white mb-4">Parent / Guardian Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Parent/Guardian Name *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="08012345678" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="parent@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Occupation</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" placeholder="e.g. Civil Servant" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-10 py-4 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors shadow-lg"
              >
                Save & Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
