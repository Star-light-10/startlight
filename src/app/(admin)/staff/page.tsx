"use client"

import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal } from "lucide-react"

type Teacher = {
  id: string
  name: string
  email: string
  role: string
  teacherProfile?: {
    employeeId: string
  }
}

export default function StaffPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Success State
  const [newCredentials, setNewCredentials] = useState<{ email: string; tempPass: string } | null>(null)

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

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to add teacher")

      // Show credentials to admin
      setNewCredentials({ email: email, tempPass: data.tempPassword })
      
      // Reset form
      setName("")
      setEmail("")
      await fetchTeachers()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Staff & Teachers</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Manage school personnel and roles.
          </p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true)
            setNewCredentials(null)
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA500] hover:bg-[#e69400] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading staff…</div>
        ) : teachers.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No teachers added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-semibold text-[#000080] dark:text-blue-400">
                      {teacher.teacherProfile?.employeeId || "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      {teacher.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {teacher.email}
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const isActive = (teacher.teacherProfile as any)?.isActive !== false;
                        return (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2 text-sm">
                        <button
                          onClick={async () => {
                            const isActive = (teacher.teacherProfile as any)?.isActive !== false;
                            if (!confirm(`Are you sure you want to mark ${teacher.name} as ${isActive ? 'Inactive' : 'Active'}?`)) return;
                            try {
                              const res = await fetch(`/api/staff/${teacher.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'toggle_status' })
                              });
                              if (res.ok) fetchTeachers();
                            } catch (e) {}
                          }}
                          className={`font-semibold hover:underline ${(teacher.teacherProfile as any)?.isActive !== false ? 'text-amber-600' : 'text-green-600'}`}
                        >
                          Mark {(teacher.teacherProfile as any)?.isActive !== false ? 'Inactive' : 'Active'}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={async () => {
                            if (!confirm(`WARNING: Deleting ${teacher.name} removes their record permanently. Are you sure?`)) return;
                            try {
                              const res = await fetch(`/api/staff/${teacher.id}`, { method: 'DELETE' });
                              if (res.ok) fetchTeachers();
                            } catch (e) {}
                          }}
                          className="font-semibold text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
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
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {newCredentials ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Teacher Added!</h3>
                  <p className="text-sm text-gray-500">Please copy these credentials and send them to the teacher securely.</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email (Login ID)</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{newCredentials.email}</p>
                    
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Temporary Password</p>
                    <p className="text-lg font-mono font-bold text-[#FFA500]">{newCredentials.tempPass}</p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors mt-4"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddTeacher} className="space-y-4">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">⚠ {errorMsg}</div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Robert Johnson"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="teacher@starlight.edu.ng"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#000080] hover:bg-[#000066] disabled:bg-[#000080]/50 text-white font-bold rounded-xl transition-colors"
                    >
                      {isSubmitting ? "Adding..." : "Add Teacher"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
