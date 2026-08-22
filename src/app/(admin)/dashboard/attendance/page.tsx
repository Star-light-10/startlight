"use client"

import { useState, useEffect } from "react"

export default function AttendanceDashboard() {
  const [mode, setMode] = useState<"mark" | "summary">("mark")
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  
  // Summary mode dates
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(1) // First day of current month
    return d.toISOString().split("T")[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0])

  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [summaryData, setSummaryData] = useState<any[]>([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  useEffect(() => {
    fetch("/api/academics/classes")
      .then(res => res.json())
      .then(data => {
        setClasses(data)
        if (data.length > 0) setSelectedClass(data[0].id)
      })
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    
    if (mode === "mark") {
      fetchMarkData()
    } else {
      fetchSummaryData()
    }
  }, [selectedClass, date, startDate, endDate, mode])

  const fetchMarkData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch all students in class (bypass pagination to get array)
      const stRes = await fetch(`/api/students?classId=${selectedClass}&paginate=false`)
      const stData = await stRes.json()
      // ensure stData is an array
      const studentsArray = Array.isArray(stData) ? stData : (stData.data || [])
      setStudents(studentsArray)

      // 2. Fetch existing attendance for this date
      const attRes = await fetch(`/api/attendance?classId=${selectedClass}&date=${date}`)
      const attData = await attRes.json()
      
      const newAtt: Record<string, string> = {}
      
      // Default everyone to PRESENT if no record exists
      studentsArray.forEach((s: any) => {
        newAtt[s.id] = "PRESENT"
      })
      
      // Override with existing records
      attData.forEach((record: any) => {
        newAtt[record.studentId] = record.status
      })
      
      setAttendance(newAtt)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const fetchSummaryData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/attendance?mode=summary&classId=${selectedClass}&startDate=${startDate}&endDate=${endDate}`)
      const data = await res.json()
      if (res.ok) setSummaryData(data)
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)
    try {
      // Get the admin user ID or just pass a placeholder
      // For now, pass a hardcoded 'admin' since we aren't using session
      const markedBy = "admin" 

      const promises = students.map(s => 
        fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: s.id,
            classId: selectedClass,
            date,
            status: attendance[s.id],
            markedBy
          })
        })
      )

      await Promise.all(promises)
      
      setToastMsg("Attendance saved successfully!")
      setTimeout(() => setToastMsg(""), 3000)
    } catch (e) {
      console.error(e)
      setToastMsg("Error saving attendance")
    }
    setIsSaving(false)
  }

  const setStatus = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Register</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Mark daily attendance or view summaries.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setMode("mark")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "mark" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setMode("summary")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === "summary" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            View Summary
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl text-center font-semibold text-sm border border-green-200 dark:border-green-800">
          {toastMsg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {mode === "mark" ? (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#000080]"
                />
              </div>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : mode === "mark" ? (
          <div>
            {students.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No students found in this class.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Admission No.</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 text-sm font-semibold">{s.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{s.admissionNumber}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setStatus(s.id, "PRESENT")}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${attendance[s.id] === "PRESENT" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                            >
                              PRESENT
                            </button>
                            <button
                              onClick={() => setStatus(s.id, "ABSENT")}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${attendance[s.id] === "ABSENT" ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                            >
                              ABSENT
                            </button>
                            <button
                              onClick={() => setStatus(s.id, "LATE")}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${attendance[s.id] === "LATE" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                            >
                              LATE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAttendance}
                disabled={isSaving || students.length === 0}
                className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
              >
                {isSaving ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {summaryData.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No attendance data found for this period.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">Admission No.</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Present</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Absent</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Late</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {summaryData.map(s => (
                      <tr key={s.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 text-sm font-semibold">{s.name}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{s.admissionNumber}</td>
                        <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">{s.present}</td>
                        <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">{s.absent}</td>
                        <td className="px-4 py-3 text-sm text-center text-amber-600 font-semibold">{s.late}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            s.percentage >= 75 ? "bg-green-100 text-green-700" :
                            s.percentage >= 50 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {s.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
