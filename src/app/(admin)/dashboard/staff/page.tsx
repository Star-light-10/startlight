"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type Teacher = {
  id: string
  name: string
  email: string
  teacherProfile?: {
    employeeId: string
  }
}

export default function StaffDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "" })

  const fetchTeachers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/teachers")
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
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to invite teacher")
      }
      setIsModalOpen(false)
      setFormData({ name: "", email: "" })
      await fetchTeachers()
      alert("Teacher successfully invited! They will receive an email shortly.")
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Invite and manage teaching staff. They will automatically receive login details via email.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap"
        >
          + Invite Teacher
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
            No teachers found. Click "+ Invite Teacher" to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                          {teacher.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{teacher.name}</div>
                          <div className="text-xs text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {teacher.teacherProfile?.employeeId || "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-black text-gray-900 dark:text-white">Invite Teacher</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setErrorMsg(null); }} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                  ⚠ {errorMsg}
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-xl text-xs">
                This will automatically generate a secure password and email it directly to the teacher so they can log in.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input 
                  required 
                  placeholder="e.g. John Doe" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#000080]" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                <input 
                  required 
                  type="email"
                  placeholder="teacher@example.com" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#000080]" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:bg-gray-400 flex items-center gap-2">
                  {isProcessing ? "Sending Email..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
