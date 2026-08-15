"use client"

import { useState, useEffect } from "react"
import { Plus, Megaphone, Trash2 } from "lucide-react"

type Announcement = {
  id: string
  title: string
  content: string
  audience: string
  createdAt: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState("ALL")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchNotices = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/notices")
      if (res.ok) setNotices(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchNotices() }, [])

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, audience }),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to create announcement")

      setIsModalOpen(false)
      setTitle("")
      setContent("")
      setAudience("ALL")
      await fetchNotices()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return
    
    try {
      await fetch(`/api/notices?id=${id}`, { method: "DELETE" })
      await fetchNotices()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Notice Board</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Broadcast announcements to teachers, students, or parents.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading announcements...</div>
        ) : notices.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            <Megaphone className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            No announcements yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notices.map((notice) => (
              <div key={notice.id} className="p-5 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{notice.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {notice.audience}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap max-w-3xl">
                    {notice.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    Posted on {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => handleDelete(notice.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#FFA500]" />
                New Announcement
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreateNotice} className="space-y-4">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">⚠ {errorMsg}</div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. End of Term Holiday"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080]" 
                  >
                    <option value="ALL">All (Staff, Students & Parents)</option>
                    <option value="STAFF">Teachers & Staff Only</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="PARENTS">Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message Content</label>
                  <textarea 
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Write your announcement here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none" 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#000080] hover:bg-[#000066] disabled:bg-[#000080]/50 text-white font-bold rounded-xl transition-colors"
                  >
                    {isSubmitting ? "Posting..." : "Post Announcement"}
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
