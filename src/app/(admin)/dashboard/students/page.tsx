"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"

type Student = {
  id: string
  admissionNumber: string
  name: string
  class: string
  status: string
}

export default function StudentsDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  
  // Single Add Form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    className: "",
  })
  
  // Bulk Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null)
  
  // Processing & Result State
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successResult, setSuccessResult] = useState<any[] | null>(null)

  // Edit student state
  const [editStudent, setEditStudent] = useState<any | null>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [editForm, setEditForm] = useState({ name: "", admissionNumber: "", classId: "" })

  // Pagination & Search
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const [stuRes, clsRes] = await Promise.all([
        fetch(`/api/students?page=${page}&limit=50&search=${encodeURIComponent(search)}`),
        fetch("/api/academics/classes"),
      ])
      if (stuRes.ok) {
        const json = await stuRes.json()
        if (json.data) {
          setStudents(json.data)
          setTotalPages(json.meta.totalPages)
          setTotalItems(json.meta.total)
        } else {
          setStudents(json)
        }
      }
      if (clsRes.ok) setClasses(await clsRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger fetch when page or search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents()
    }, 300) // debounce search
    return () => clearTimeout(timer)
  }, [page, search])

  const openEdit = (s: Student) => {
    setEditStudent(s)
    setEditForm({ name: s.name, admissionNumber: s.admissionNumber, classId: (s as any).classId || "" })
  }

  const handleEditSave = async () => {
    if (!editStudent) return
    setIsProcessing(true)
    try {
      const res = await fetch(`/api/students/${editStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        setEditStudent(null)
        fetchStudents()
      } else {
        const d = await res.json()
        alert(d.error || "Update failed")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return
    await fetch(`/api/students/${id}`, { method: "DELETE" })
    fetchStudents()
  }

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add student")
      
      setSuccessResult(data.students)
      setIsAddOpen(false)
      setFormData({ firstName: "", lastName: "", className: "" })
      fetchStudents()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTemplate = () => {
    const csv = [
      "firstName,lastName,className,gender,parentName,parentPhone",
      "Amina,Bello,JSS 1,Female,Musa Bello,08012345678",
      "Tunde,Adeyemi,JSS 2,Male,Bisi Adeyemi,08098765432",
      "Fatima,Musa,SSS 1,Female,Ibrahim Musa,07034561234",
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students_import_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleBulkSubmit = async () => {
    if (!csvFile) return
    setIsProcessing(true)
    setErrorMsg(null)

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.data),
          })
          
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "Failed to import students")
          
          setSuccessResult(data.students)
          setIsBulkOpen(false)
          setCsvFile(null)
          fetchStudents()
        } catch (e: any) {
          setErrorMsg(e.message)
        } finally {
          setIsProcessing(false)
        }
      },
      error: (error) => {
        setErrorMsg(error.message)
        setIsProcessing(false)
      }
    })
  }

  const handleExportCSV = async () => {
    // Fetch all students without pagination for the export
    const res = await fetch(`/api/students?paginate=false&search=${encodeURIComponent(search)}`)
    const allStudents = await res.json()
    
    const dataToExport = allStudents.map((s: any) => ({
      "Admission No": s.admissionNumber,
      Name: s.name,
      Class: s.class,
      Status: s.status,
    }))
    const csv = Papa.unparse(dataToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Students Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {totalItems} total student{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button
            onClick={() => { setIsAddOpen(true); setErrorMsg(null) }}
            className="px-4 py-2 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            + Add Student
          </button>
          <button
            onClick={() => { setIsBulkOpen(true); setErrorMsg(null) }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
        </div>
      </div>

      {/* Result Screen */}
      {successResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-green-800 dark:text-green-400">Successfully Added {successResult.length} Student(s)</h2>
              <p className="text-sm text-green-600 dark:text-green-500">Please save the credentials below. Passwords cannot be recovered later.</p>
            </div>
            <button onClick={() => setSuccessResult(null)} className="text-green-600 hover:text-green-800 font-bold text-sm bg-green-100 px-3 py-1.5 rounded-lg">Dismiss</button>
          </div>
          <div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-xl border border-green-100 dark:border-green-800">
            <table className="min-w-full text-sm divide-y divide-gray-100 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">Admission No.</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600">Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {successResult.map(s => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-semibold">{s.name}</td>
                    <td className="px-4 py-3 text-[#000080] font-mono">{s.admissionNumber}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3 font-mono text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-gray-800">{s.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-black">Edit Student</h2>
              <button onClick={() => setEditStudent(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Admission Number</label>
                <input value={editForm.admissionNumber} onChange={e => setEditForm({...editForm, admissionNumber: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#000080]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Class</label>
                <select value={editForm.classId} onChange={e => setEditForm({...editForm, classId: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]">
                  <option value="">— No Change —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}{c.section ? ` ${c.section}` : ""}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleEditSave} disabled={isProcessing}
                  className="flex-1 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:opacity-50">
                  {isProcessing ? "Saving…" : "Save Changes"}
                </button>
                <button onClick={() => setEditStudent(null)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, admission no, class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Admission No.</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-sm text-[#000080] dark:text-blue-400 font-bold">{s.admissionNumber}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">{s.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{s.class}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEdit(s)} className="px-3 py-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200">✏ Edit</button>
                      <button onClick={() => handleDelete(s.id, s.name)} className="px-3 py-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200">🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Single Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-black mb-4">Add Existing Student</h2>
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{errorMsg}</div>}
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">First Name</label>
                <input required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Last Name</label>
                <input required className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Class (e.g. JSS 1)</label>
                <input required placeholder="Must match exactly" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-4 py-2 font-bold text-white bg-[#000080] hover:bg-[#000066] rounded-xl disabled:bg-gray-400">
                  {isProcessing ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-black">Bulk Import Students</h2>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-xs font-bold text-[#000080] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Template
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Download the template above, fill it in with your students&apos; data, then upload it here.
              Required columns: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-800 dark:text-gray-200">firstName, lastName, className</code>
            </p>

            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{errorMsg}</div>}

            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center mb-6 bg-gray-50 dark:bg-gray-800/50">
              {csvFile ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{csvFile.name}</span>
                  </div>
                  <button onClick={() => setCsvFile(null)} className="text-xs text-red-500 hover:text-red-700 font-bold">Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Click to select your CSV file</p>
                  <p className="text-xs text-gray-400 mt-1">.csv files only</p>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsBulkOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleBulkSubmit} disabled={isProcessing || !csvFile} className="px-4 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:bg-gray-400">
                {isProcessing ? "Importing..." : "Start Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
