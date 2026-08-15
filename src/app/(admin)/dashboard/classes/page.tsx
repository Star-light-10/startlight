"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Users } from "lucide-react"

type ClassData = {
  id: string
  name: string
  section: string | null
  capacity: number | null
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [name, setName] = useState("")
  const [section, setSection] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchClasses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/classes")
      if (res.ok) setClasses(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchClasses() }, [])

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, section, capacity }),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to add class")

      // Success
      setIsModalOpen(false)
      setName("")
      setSection("")
      setCapacity("")
      await fetchClasses()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Classes</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Manage school classes, sections, and capacities.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search classes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm space-y-3">
            <p>No classes created yet.</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 max-w-md mx-auto">
              You must create at least one class (e.g. "JSS 1") before you can accept any student admissions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {classes.map((cls) => (
              <div key={cls.id} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#000080] dark:hover:border-[#FFA500] transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl text-gray-900 dark:text-white group-hover:text-[#000080] dark:group-hover:text-[#FFA500] transition-colors">
                    {cls.name}
                  </h3>
                  {cls.section && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300 rounded-lg">
                      {cls.section}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {cls.capacity ? cls.capacity : "Unlimited"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-black text-gray-900 dark:text-white">Add New Class</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddClass} className="space-y-4">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">⚠ {errorMsg}</div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. JSS 1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Make sure this matches exactly what applicants select in the form.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Section (Optional)</label>
                  <input 
                    type="text" 
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. Science, Gold"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Capacity (Optional)</label>
                  <input 
                    type="number" 
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 40"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#000080] hover:bg-[#000066] disabled:bg-[#000080]/50 text-white font-bold rounded-xl transition-colors"
                  >
                    {isSubmitting ? "Adding..." : "Add Class"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
