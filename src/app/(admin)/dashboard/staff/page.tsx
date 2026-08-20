"use client"

import { useState, useEffect } from "react"

type Teacher = {
  id: string
  name: string
  email: string
  teacherProfile?: {
    employeeId: string
  }
}

type Credentials = {
  name: string
  email: string
  tempPassword: string
  employeeId?: string
}

function CredentialsCard({ creds, onClose }: { creds: Credentials; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const text = `STARLIGHT SCHOOL — Teacher Login Details\n\nName: ${creds.name}\nEmail: ${creds.email}\nPassword: ${creds.tempPassword}${creds.employeeId ? `\nEmployee ID: ${creds.employeeId}` : ""}\n\nPlease change your password after first login.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="bg-green-500 p-5 text-white text-center">
          <div className="text-3xl mb-1">✓</div>
          <h2 className="text-lg font-black">Teacher Account Created!</h2>
          <p className="text-green-100 text-sm">Share these login details with the teacher</p>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 font-mono text-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-sans text-xs font-bold uppercase">Name</span>
              <span className="font-bold">{creds.name}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center">
              <span className="text-gray-500 font-sans text-xs font-bold uppercase">Email (Login)</span>
              <span className="font-bold text-[#000080] dark:text-blue-400">{creds.email}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center">
              <span className="text-gray-500 font-sans text-xs font-bold uppercase">Password</span>
              <span className="font-black text-[#FFA500] tracking-widest text-base">{creds.tempPassword}</span>
            </div>
            {creds.employeeId && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center">
                <span className="text-gray-500 font-sans text-xs font-bold uppercase">Employee ID</span>
                <span className="font-bold">{creds.employeeId}</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-400">
            ⚠ This password is only shown once. Copy and share it with the teacher securely.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={copyAll}
              className="flex-1 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors text-sm"
            >
              {copied ? "✓ Copied!" : "📋 Copy Login Details"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StaffDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)
  const [resettingId, setResettingId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" })

  const fetchTeachers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/staff")
      if (res.ok) setTeachers(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create teacher")

      setIsModalOpen(false)
      setFormData({ name: "", email: "" })
      await fetchTeachers()

      // Show credentials card
      setCredentials({
        name: formData.name,
        email: formData.email,
        tempPassword: data.tempPassword,
        employeeId: data.employeeId,
      })
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetPassword = async (teacher: Teacher) => {
    if (!confirm(`Reset password for ${teacher.name}? A new temporary password will be generated.`)) return

    setResettingId(teacher.id)
    try {
      const res = await fetch(`/api/staff/${teacher.id}`, {
        method: "PATCH",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to reset password")

      setCredentials({
        name: teacher.name,
        email: data.email,
        tempPassword: data.tempPassword,
      })
    } catch (e: any) {
      alert("Error: " + e.message)
    } finally {
      setResettingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Credentials Modal */}
      {credentials && (
        <CredentialsCard creds={credentials} onClose={() => setCredentials(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Add teachers and manage their login credentials.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          + Add Teacher
        </button>
      </div>

      {errorMsg && !isModalOpen && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800 text-sm font-medium">
          ⚠ {errorMsg}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading staff…</div>
        ) : teachers.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            No teachers found. Click &quot;+ Add Teacher&quot; to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Login Email</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                          {teacher.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-[#000080] dark:text-blue-400">
                      {teacher.email}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {teacher.teacherProfile?.employeeId || "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleResetPassword(teacher)}
                        disabled={resettingId === teacher.id}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {resettingId === teacher.id ? "Resetting…" : "🔑 Reset Password"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-black text-gray-900 dark:text-white">Add New Teacher</h2>
              <button
                onClick={() => { setIsModalOpen(false); setErrorMsg(null) }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                  ⚠ {errorMsg}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300 p-3 rounded-xl text-xs">
                A secure login password will be generated automatically. You will see it once after creation — copy and share it with the teacher.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#000080] focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="teacher@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#000080] focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  {isProcessing ? "Creating…" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
