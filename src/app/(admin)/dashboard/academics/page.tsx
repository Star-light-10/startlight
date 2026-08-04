"use client"

import { useState, useEffect } from "react"

export default function AcademicsDashboard() {
  const [activeTab, setActiveTab] = useState<"classes" | "subjects" | "terms">("classes")
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  
  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const [clsRes, subRes, termRes] = await Promise.all([
        fetch("/api/academics/classes"),
        fetch("/api/academics/subjects"),
        fetch("/api/academics/terms")
      ])
      
      if (clsRes.ok) setClasses(await clsRes.json())
      if (subRes.ok) setSubjects(await subRes.json())
      if (termRes.ok) setTerms(await termRes.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    await fetch("/api/academics/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    
    e.currentTarget.reset()
    setIsSubmitting(false)
    fetchData()
  }

  const handleCreateSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    await fetch("/api/academics/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    
    e.currentTarget.reset()
    setIsSubmitting(false)
    fetchData()
  }

  const handleCreateTerm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      name: formData.get("name"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      isActive: formData.get("isActive") === "on"
    }

    await fetch("/api/academics/terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    e.currentTarget.reset()
    setIsSubmitting(false)
    fetchData()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academics</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage classes, subjects, and academic terms.</p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          {(["classes", "subjects", "terms"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-[#000080] text-[#000080] dark:border-[#FFA500] dark:text-[#FFA500]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        
        {/* CLASSES TAB */}
        {activeTab === "classes" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Add New Class</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class Name</label>
                  <input name="name" required placeholder="e.g. JSS 1" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section / Arm (Optional)</label>
                  <input name="section" placeholder="e.g. A" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input name="capacity" type="number" placeholder="e.g. 40" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#000080] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#000066] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Create Class"}
                </button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4">Existing Classes</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {classes.map((c) => (
                      <tr key={c.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{c.name} {c.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.capacity || "Unlimited"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c._count?.students || 0}</td>
                      </tr>
                    ))}
                    {classes.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No classes found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === "subjects" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Add New Subject</h3>
              <form onSubmit={handleCreateSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Name</label>
                  <input name="name" required placeholder="e.g. Mathematics" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Code</label>
                  <input name="code" placeholder="e.g. MTH101" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#000080] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#000066] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Create Subject"}
                </button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4">Existing Subjects</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {subjects.map((s) => (
                      <tr key={s.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{s.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.code || "-"}</td>
                      </tr>
                    ))}
                    {subjects.length === 0 && (
                      <tr><td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">No subjects found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TERMS TAB */}
        {activeTab === "terms" && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Add Academic Term</h3>
              <form onSubmit={handleCreateTerm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Term Name</label>
                  <input name="name" required placeholder="e.g. First Term 2026/2027" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input name="startDate" type="date" required className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input name="endDate" type="date" required className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="isActive" id="isActive" />
                  <label htmlFor="isActive" className="text-sm font-medium">Set as Active Term</label>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#000080] text-white py-2 rounded-lg font-medium text-sm hover:bg-[#000066] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Create Term"}
                </button>
              </form>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold mb-4">Academic Terms</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {terms.map((t) => (
                      <tr key={t.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{t.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {t.isActive ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {terms.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No terms found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
