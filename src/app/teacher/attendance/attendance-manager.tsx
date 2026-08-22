"use client"

import { useState, useEffect } from "react"
import { Check, X, Clock, AlertCircle } from "lucide-react"

type Class = { id: string; name: string }
type Student = { 
  id: string; 
  admissionNumber: string;
  user: { name: string | null }
}
type AttendanceRecord = {
  id: string;
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function AttendanceManager({ classes, userId }: { classes: Class[], userId: string }) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || "")
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, "PRESENT" | "ABSENT" | "LATE">>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch students for the class
  useEffect(() => {
    if (!selectedClass) return
    const fetchStudents = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/students?classId=${selectedClass}&paginate=false`)
        if (res.ok) {
          const data = await res.json()
          setStudents(Array.isArray(data) ? data : (data.data || []))
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [selectedClass])

  // Fetch existing attendance for this class and date
  useEffect(() => {
    if (!selectedClass || !date) return
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/attendance?classId=${selectedClass}&date=${date}`)
        if (res.ok) {
          const data: AttendanceRecord[] = await res.json()
          const attMap: Record<string, "PRESENT" | "ABSENT" | "LATE"> = {}
          data.forEach(r => attMap[r.studentId] = r.status)
          setAttendance(attMap)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchAttendance()
  }, [selectedClass, date])

  const markStudent = async (studentId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    // Optimistic UI update
    setAttendance(prev => ({ ...prev, [studentId]: status }))
    
    setIsSaving(true)
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          classId: selectedClass,
          date,
          status,
          markedBy: userId
        })
      })
    } catch (e) {
      console.error(e)
      // Revert if failed (simplified for now)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status?: string) => {
    if (status === "PRESENT") return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (status === "ABSENT") return "bg-red-100 text-red-700 border-red-200"
    if (status === "LATE") return "bg-orange-100 text-orange-700 border-orange-200"
    return "bg-gray-50 text-gray-400 border-gray-200"
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
            >
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]"
            />
          </div>
        </div>
        
        <div className="text-sm font-semibold text-gray-500 flex items-center gap-2">
          {isSaving && <span className="animate-pulse text-[#FFA500]">Saving...</span>}
        </div>
      </div>

      {/* Student List */}
      <div className="p-0 sm:p-4 flex-1">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center">
            <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
            No students found in this class.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 sm:border sm:border-gray-100 sm:rounded-xl">
            {students.map((student, idx) => {
              const currentStatus = attendance[student.id]
              return (
                <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{student.user.name || "Unknown"}</h3>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{student.admissionNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => markStudent(student.id, "PRESENT")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        currentStatus === "PRESENT" 
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-inner" 
                          : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> P
                    </button>
                    <button
                      onClick={() => markStudent(student.id, "LATE")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        currentStatus === "LATE" 
                          ? "bg-orange-500 text-white border-orange-600 shadow-inner" 
                          : "bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" /> L
                    </button>
                    <button
                      onClick={() => markStudent(student.id, "ABSENT")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        currentStatus === "ABSENT" 
                          ? "bg-red-500 text-white border-red-600 shadow-inner" 
                          : "bg-white text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" /> A
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
