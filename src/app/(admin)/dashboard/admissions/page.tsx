"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type Application = {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  gender: string
  religion: string
  homeAddress: string
  classApplyingFor: string
  passportPhotoUrl?: string
  status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"
  parentName: string
  parentPhone: string
  parentEmail?: string
  parentOccupation?: string
  createdAt: string
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  PENDING:   { label: "Pending",   classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  REVIEWING: { label: "Reviewing", classes: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  ACCEPTED:  { label: "Accepted",  classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  REJECTED:  { label: "Rejected",  classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
}

export default function AdmissionsDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  
  // Modals state
  const [selected, setSelected] = useState<Application | null>(null)
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Form State
  const [formData, setFormData] = useState<Partial<Application>>({})

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admissions/list")
      if (res.ok) setApplications(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchApplications() }, [])

  const handleAction = async (id: string, action: "ACCEPT" | "REJECT") => {
    setProcessingId(id)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to process application")
      }
      setSelected(null)
      await fetchApplications()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this application? This cannot be undone.")) return;
    
    setProcessingId(id)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admissions/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete application")
      }
      setSelected(null)
      await fetchApplications()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessingId("form-submit")
    setErrorMsg(null)

    const isEditing = isEditMode && selected?.id;
    const url = isEditing 
      ? `/api/admissions/${selected.id}` 
      : "/api/admissions/manual";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save application")
      }
      
      setIsManualEntryOpen(false)
      setIsEditMode(false)
      setSelected(null)
      setFormData({})
      await fetchApplications()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setProcessingId(null)
    }
  }

  const openManualEntry = () => {
    setFormData({
      status: "PENDING",
      dateOfBirth: "2015-01-01",
      gender: "Male",
      religion: "Islam"
    })
    setErrorMsg(null)
    setIsEditMode(false)
    setIsManualEntryOpen(true)
  }

  const openEdit = (app: Application) => {
    setFormData({
      ...app,
      dateOfBirth: new Date(app.dateOfBirth).toISOString().split('T')[0]
    })
    setErrorMsg(null)
    setIsEditMode(true)
    setIsManualEntryOpen(true)
  }

  const filtered = applications.filter((app) => {
    const matchesSearch =
      `${app.firstName} ${app.lastName} ${app.parentPhone} ${app.classApplyingFor}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const counts = {
    ALL: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
    ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admissions Review</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {applications.length} total application{applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openManualEntry}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            + Manual Entry
          </button>
          <a
            href="/admissions"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            Open Form
          </a>
        </div>
      </div>

      {errorMsg && !selected && !isManualEntryOpen && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-100 dark:border-red-800 text-sm font-medium">
          ⚠ {errorMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone, class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["ALL", "PENDING", "REVIEWING", "ACCEPTED", "REJECTED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                statusFilter === s
                  ? "bg-[#000080] text-white border-[#000080]"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#000080] dark:hover:border-blue-500"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              <span className="ml-1.5 opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            {search || statusFilter !== "ALL" ? "No applications match your filters." : "No applications yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applied On</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 relative">
                          {app.passportPhotoUrl ? (
                            <Image src={app.passportPhotoUrl} alt="Photo" fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                              {app.firstName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {app.firstName} {app.lastName}
                          </div>
                          <div className="text-xs text-gray-400">{app.parentPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{app.classApplyingFor}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {new Date(app.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig[app.status]?.classes}`}>
                        {statusConfig[app.status]?.label ?? app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(app)}
                        className="text-xs font-semibold text-[#000080] dark:text-blue-400 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && !isManualEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="font-black text-gray-900 dark:text-white">Application Details</h2>
              <div className="flex items-center gap-4">
                {selected.status !== "ACCEPTED" && (
                  <>
                    <button onClick={() => openEdit(selected)} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(selected.id)} disabled={!!processingId} className="text-sm font-bold text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </>
                )}
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo + Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative flex-shrink-0">
                  {selected.passportPhotoUrl ? (
                    <Image src={selected.passportPhotoUrl} alt="Photo" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-xl font-bold">
                      {selected.firstName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {selected.firstName} {selected.middleName} {selected.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">Applying for: <span className="font-semibold text-[#000080] dark:text-blue-400">{selected.classApplyingFor}</span></p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusConfig[selected.status]?.classes}`}>
                    {statusConfig[selected.status]?.label ?? selected.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Date of Birth", value: new Date(selected.dateOfBirth).toLocaleDateString("en-GB") },
                  { label: "Gender", value: selected.gender },
                  { label: "Religion", value: selected.religion },
                  { label: "Applied On", value: new Date(selected.createdAt).toLocaleDateString("en-GB") },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Home Address</p>
                <p className="text-sm text-gray-900 dark:text-white">{selected.homeAddress}</p>
              </div>

              {/* Parent/Guardian */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Parent / Guardian</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Name", value: selected.parentName },
                    { label: "Phone", value: selected.parentPhone },
                    { label: "Email", value: selected.parentEmail || "—" },
                    { label: "Occupation", value: selected.parentOccupation || "—" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error in modal */}
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800">
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              {selected.status === "PENDING" || selected.status === "REVIEWING" ? (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleAction(selected.id, "ACCEPT")}
                    disabled={!!processingId}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    {processingId === selected.id ? "Processing…" : "✓ Accept & Enroll"}
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, "REJECT")}
                    disabled={!!processingId}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    {processingId === selected.id ? "…" : "✗ Reject"}
                  </button>
                </div>
              ) : (
                <div className="pt-2 text-center text-sm text-gray-400">
                  This application has already been <span className="font-semibold">{selected.status.toLowerCase()}</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry & Edit Modal */}
      {isManualEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h2 className="font-black text-gray-900 dark:text-white">
                {isEditMode ? "Edit Application" : "Manual Applicant Entry"}
              </h2>
              <button 
                onClick={() => {
                  setIsManualEntryOpen(false)
                  if (!isEditMode) setFormData({})
                }} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveForm} className="overflow-y-auto p-6 space-y-6 flex-1">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                  ⚠ {errorMsg}
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Applicant Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="First Name" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.firstName || ""} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  <input placeholder="Middle Name" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.middleName || ""} onChange={e => setFormData({...formData, middleName: e.target.value})} />
                  <input required placeholder="Last Name" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.lastName || ""} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  <input required type="date" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.dateOfBirth || ""} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                  <select required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.gender || ""} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.religion || ""} onChange={e => setFormData({...formData, religion: e.target.value})}>
                    <option value="Islam">Islam</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Admission Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.classApplyingFor || ""} onChange={e => setFormData({...formData, classApplyingFor: e.target.value})}>
                    <option value="" disabled>Select Class</option>
                    <option value="Creche">Creche</option>
                    <option value="Pre-Nursery">Pre-Nursery</option>
                    <option value="Nursery 1">Nursery 1</option>
                    <option value="Nursery 2">Nursery 2</option>
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2">Primary 2</option>
                    <option value="Primary 3">Primary 3</option>
                    <option value="Primary 4">Primary 4</option>
                    <option value="Primary 5">Primary 5</option>
                    <option value="Primary 6">Primary 6</option>
                    <option value="JSS 1">JSS 1</option>
                    <option value="JSS 2">JSS 2</option>
                    <option value="JSS 3">JSS 3</option>
                    <option value="SSS 1">SSS 1</option>
                    <option value="SSS 2">SSS 2</option>
                    <option value="SSS 3">SSS 3</option>
                  </select>
                  <select className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.status || "PENDING"} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWING">Reviewing</option>
                  </select>
                  <input required placeholder="Home Address" className="sm:col-span-2 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.homeAddress || ""} onChange={e => setFormData({...formData, homeAddress: e.target.value})} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Parent Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="Parent Name" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.parentName || ""} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                  <input required placeholder="Phone Number" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.parentPhone || ""} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                  <input type="email" placeholder="Email Address (Optional)" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.parentEmail || ""} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                  <input placeholder="Occupation" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.parentOccupation || ""} onChange={e => setFormData({...formData, parentOccupation: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsManualEntryOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={!!processingId} className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:bg-gray-400">
                  {processingId === "form-submit" ? "Saving..." : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
