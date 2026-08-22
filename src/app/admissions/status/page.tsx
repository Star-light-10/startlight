"use client"

import { useState } from "react"
import Link from "next/link"
import { StarlightLogo } from "@/components/starlight-logo"

export default function ApplicationStatusPage() {
  const [applicationId, setApplicationId] = useState("")
  const [statusData, setStatusData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setStatusData(null)

    try {
      const res = await fetch(`/api/admissions/status?id=${encodeURIComponent(applicationId.trim())}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Application not found")
      }
      const data = await res.json()
      setStatusData(data)
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <StarlightLogo className="w-9 h-9" />
              <div>
                <p className="font-black text-[#000080] dark:text-white text-xs">STARLIGHT MODEL SCHOOL</p>
                <p className="text-[9px] text-[#FFA500] font-semibold tracking-widest">Application Status Tracker</p>
              </div>
            </Link>
            <Link href="/admissions" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold">
              ← New Application
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Track Application</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your Application ID below to check your admission status and download your letter.</p>
          </div>

          <form onSubmit={handleCheckStatus} className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 border border-gray-100 dark:border-gray-800 mb-6">
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Application ID</label>
              <input
                type="text"
                required
                value={applicationId}
                onChange={e => setApplicationId(e.target.value)}
                placeholder="e.g. cm7..."
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#000080]"
              />
            </div>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
                ⚠ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !applicationId.trim()}
              className="w-full py-4 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isLoading ? "Searching..." : "Check Status →"}
            </button>
          </form>

          {/* Results */}
          {statusData && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-b border-blue-100 dark:border-blue-900">
                <h3 className="font-bold text-[#000080] dark:text-blue-400">Application Details</h3>
              </div>
              <div className="p-6 space-y-4">
                
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Applicant Name</p>
                  <p className="font-bold text-gray-900 dark:text-white">{statusData.firstName} {statusData.lastName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Class</p>
                  <p className="font-bold text-gray-900 dark:text-white">{statusData.classApplyingFor}</p>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Application Fee Status</p>
                  {statusData.hasPaidFee ? (
                    <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">✓ Verified Paid</span>
                  ) : (
                    <div className="space-y-2">
                      <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Pending Verification</span>
                      <p className="text-xs text-gray-500">
                        If you have paid the ₦2,000 fee, please send the receipt via WhatsApp to <strong>+234 805 680 9200</strong>.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Admission Status</p>
                  {statusData.status === "PENDING" && <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">Pending Review</span>}
                  {statusData.status === "REVIEWING" && <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Under Review</span>}
                  {statusData.status === "REJECTED" && <span className="inline-flex px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Not Admitted</span>}
                  {statusData.status === "ACCEPTED" && <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Admitted! 🎉</span>}
                </div>

                {/* Admission Letter Download */}
                {statusData.hasPaidFee && statusData.status === "ACCEPTED" && (
                  <div className="pt-4">
                    <a
                      href={`/admissions/letter/${statusData.id}`}
                      target="_blank"
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FFA500] hover:bg-[#E69500] text-[#000080] font-black rounded-xl transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Admission Letter
                    </a>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
