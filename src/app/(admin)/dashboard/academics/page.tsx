"use client"

import { useState, useEffect } from "react"

type EditState = { id: string; [key: string]: any } | null

function EditModal({ title, fields, onSave, onClose, isSaving }: {
  title: string
  fields: { key: string; label: string; type?: string; required?: boolean }[]
  onSave: (data: Record<string, any>) => void
  onClose: () => void
  isSaving: boolean
}) {
  const [form, setForm] = useState<Record<string, any>>({})
  useEffect(() => { setForm({}) }, [title])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-black text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
              {f.type === "checkbox" ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm">Set as Active Term</span>
                </label>
              ) : (
                <input
                  type={f.type || "text"}
                  required={f.required}
                  value={form[f.key] || ""}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => onSave(form)} disabled={isSaving} className="flex-1 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:opacity-50">
              {isSaving ? "Saving…" : "Save Changes"}
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AcademicsDashboard() {
  const [activeTab, setActiveTab] = useState<"classes" | "subjects" | "terms">("classes")
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [terms, setTerms] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editItem, setEditItem] = useState<EditState>(null)
  const [editType, setEditType] = useState<"class" | "subject" | "term" | null>(null)

  const fetchData = async () => {
    const [clsRes, subRes, termRes] = await Promise.all([
      fetch("/api/academics/classes"),
      fetch("/api/academics/subjects"),
      fetch("/api/academics/terms"),
    ])
    if (clsRes.ok) setClasses(await clsRes.json())
    if (subRes.ok) setSubjects(await subRes.json())
    if (termRes.ok) setTerms(await termRes.json())
  }

  useEffect(() => { fetchData() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>, endpoint: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const payload: Record<string, any> = Object.fromEntries(formData)
    if ("isActive" in payload) payload.isActive = payload.isActive === "on"

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    e.currentTarget.reset()
    setIsSubmitting(false)
    fetchData()
  }

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure you want to delete this? This cannot be undone.")) return
    await fetch(`${endpoint}/${id}`, { method: "DELETE" })
    fetchData()
  }

  const handleEdit = async (endpoint: string, id: string, data: Record<string, any>) => {
    setIsSubmitting(true)
    await fetch(`${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setEditItem(null)
    setEditType(null)
    setIsSubmitting(false)
    fetchData()
  }

  const inputCls = "w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000080]"

  const ActionBtns = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div className="flex gap-2 justify-end">
      <button onClick={onEdit} className="px-3 py-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200">✏ Edit</button>
      <button onClick={onDelete} className="px-3 py-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200">🗑 Delete</button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Edit Modals */}
      {editType === "class" && editItem && (
        <EditModal
          title="Edit Class"
          fields={[
            { key: "name", label: "Class Name", required: true },
            { key: "section", label: "Section / Arm" },
            { key: "capacity", label: "Capacity", type: "number" },
          ]}
          onSave={data => handleEdit("/api/academics/classes", editItem.id, { ...editItem, ...data })}
          onClose={() => { setEditItem(null); setEditType(null) }}
          isSaving={isSubmitting}
        />
      )}
      {editType === "subject" && editItem && (
        <EditModal
          title="Edit Subject"
          fields={[
            { key: "name", label: "Subject Name", required: true },
            { key: "code", label: "Subject Code" },
          ]}
          onSave={data => handleEdit("/api/academics/subjects", editItem.id, { ...editItem, ...data })}
          onClose={() => { setEditItem(null); setEditType(null) }}
          isSaving={isSubmitting}
        />
      )}
      {editType === "term" && editItem && (
        <EditModal
          title="Edit Academic Term"
          fields={[
            { key: "name", label: "Term Name", required: true },
            { key: "startDate", label: "Start Date", type: "date", required: true },
            { key: "endDate", label: "End Date", type: "date", required: true },
            { key: "isActive", label: "Active Term", type: "checkbox" },
          ]}
          onSave={data => handleEdit("/api/academics/terms", editItem.id, { ...editItem, ...data })}
          onClose={() => { setEditItem(null); setEditType(null) }}
          isSaving={isSubmitting}
        />
      )}

      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Academics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage classes, subjects, and academic terms.</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          {(["classes", "subjects", "terms"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-[#000080] text-[#000080] dark:border-[#FFA500] dark:text-[#FFA500]"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab} ({activeTab === "classes" && tab === "classes" ? classes.length : activeTab === "subjects" && tab === "subjects" ? subjects.length : activeTab === "terms" && tab === "terms" ? terms.length : tab === "classes" ? classes.length : tab === "subjects" ? subjects.length : terms.length})
            </button>
          ))}
        </nav>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* CREATE FORM */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            {activeTab === "classes" && (
              <>
                <h3 className="font-black mb-4">Add New Class</h3>
                <form onSubmit={e => handleCreate(e, "/api/academics/classes")} className="space-y-3">
                  <input name="name" required placeholder="Class Name (e.g. JSS 1)" className={inputCls} />
                  <input name="section" placeholder="Section / Arm (e.g. A)" className={inputCls} />
                  <input name="capacity" type="number" placeholder="Capacity (e.g. 40)" className={inputCls} />
                  <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#000080] text-white font-bold rounded-xl hover:bg-[#000066] disabled:opacity-50">
                    {isSubmitting ? "Saving…" : "+ Create Class"}
                  </button>
                </form>
              </>
            )}
            {activeTab === "subjects" && (
              <>
                <h3 className="font-black mb-4">Add New Subject</h3>
                <form onSubmit={e => handleCreate(e, "/api/academics/subjects")} className="space-y-3">
                  <input name="name" required placeholder="Subject Name (e.g. Mathematics)" className={inputCls} />
                  <input name="code" placeholder="Subject Code (e.g. MTH101)" className={inputCls} />
                  <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#000080] text-white font-bold rounded-xl hover:bg-[#000066] disabled:opacity-50">
                    {isSubmitting ? "Saving…" : "+ Create Subject"}
                  </button>
                </form>
              </>
            )}
            {activeTab === "terms" && (
              <>
                <h3 className="font-black mb-4">Add Academic Term</h3>
                <form onSubmit={e => handleCreate(e, "/api/academics/terms")} className="space-y-3">
                  <input name="name" required placeholder="Term Name (e.g. First Term 2026/2027)" className={inputCls} />
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Start Date</label>
                    <input name="startDate" type="date" required className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">End Date</label>
                    <input name="endDate" type="date" required className={inputCls} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isActive" className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium">Set as Active Term</span>
                  </label>
                  <button type="submit" disabled={isSubmitting} className="w-full py-2.5 bg-[#000080] text-white font-bold rounded-xl hover:bg-[#000066] disabled:opacity-50">
                    {isSubmitting ? "Saving…" : "+ Create Term"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {activeTab === "classes" && (
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Section</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Capacity</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Students</th>
                    <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {classes.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3 font-bold text-sm">{c.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{c.section || "—"}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{c.capacity || "Unlimited"}</td>
                      <td className="px-5 py-3 text-sm">{c._count?.students || 0}</td>
                      <td className="px-5 py-3">
                        <ActionBtns
                          onEdit={() => { setEditItem(c); setEditType("class") }}
                          onDelete={() => handleDelete("/api/academics/classes", c.id)}
                        />
                      </td>
                    </tr>
                  ))}
                  {classes.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">No classes found.</td></tr>}
                </tbody>
              </table>
            )}

            {activeTab === "subjects" && (
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th>
                    <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3 font-bold text-sm">{s.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 font-mono">{s.code || "—"}</td>
                      <td className="px-5 py-3">
                        <ActionBtns
                          onEdit={() => { setEditItem(s); setEditType("subject") }}
                          onDelete={() => handleDelete("/api/academics/subjects", s.id)}
                        />
                      </td>
                    </tr>
                  ))}
                  {subjects.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-400 text-sm">No subjects found.</td></tr>}
                </tbody>
              </table>
            )}

            {activeTab === "terms" && (
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Term</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Duration</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {terms.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-5 py-3 font-bold text-sm">{t.name}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${t.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {t.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <ActionBtns
                          onEdit={() => { setEditItem({ ...t, startDate: t.startDate?.slice(0, 10), endDate: t.endDate?.slice(0, 10) }); setEditType("term") }}
                          onDelete={() => handleDelete("/api/academics/terms", t.id)}
                        />
                      </td>
                    </tr>
                  ))}
                  {terms.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No terms found.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
