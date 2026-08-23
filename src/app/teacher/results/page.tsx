"use client"

import { useState, useEffect } from "react"

interface Class { id: string; name: string }
interface Term { id: string; name: string; session: string }
interface Subject { id: string; name: string }
interface Student { id: string; user: { name: string }; admissionNumber: string }
interface Grade {
  subjectId: string
  caScore: string
  examScore: string
  total: number
  grade: string
}

function getGrade(total: number) {
  if (total >= 70) return "A"
  if (total >= 60) return "B"
  if (total >= 50) return "C"
  if (total >= 40) return "D"
  return "F"
}

function gradeColor(g: string) {
  return g === "A" ? "bg-green-100 text-green-700"
    : g === "B" ? "bg-blue-100 text-blue-700"
    : g === "C" ? "bg-yellow-100 text-yellow-700"
    : g === "D" ? "bg-orange-100 text-orange-700"
    : "bg-red-100 text-red-700"
}

export default function TeacherResultsPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])

  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [grades, setGrades] = useState<Record<string, Grade>>({})
  const [remarks, setRemarks] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Load dropdowns
  useEffect(() => {
    fetch("/api/academics/classes").then(r => r.json()).then(d => setClasses(d.data ?? d))
    fetch("/api/academics/terms").then(r => r.json()).then(d => setTerms(d.data ?? d))
    fetch("/api/academics/subjects").then(r => r.json()).then(d => setSubjects(d.data ?? d))
  }, [])

  // Load students when class changes
  useEffect(() => {
    if (!selectedClass) { setStudents([]); setSelectedStudent(""); return }
    fetch(`/api/students?classId=${selectedClass}&paginate=false`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : (d.data ?? [])
        setStudents(list)
        setSelectedStudent("")
        setGrades({})
      })
  }, [selectedClass])

  // Load existing results when student+term changes
  useEffect(() => {
    if (!selectedStudent || !selectedTerm) { setGrades({}); return }
    fetch(`/api/results?studentId=${selectedStudent}&termId=${selectedTerm}`)
      .then(r => r.json())
      .then(d => {
        if (d?.grades) {
          const loaded: Record<string, Grade> = {}
          d.grades.forEach((g: any) => {
            loaded[g.subjectId] = {
              subjectId: g.subjectId,
              caScore: String(g.caScore ?? ""),
              examScore: String(g.examScore ?? ""),
              total: (g.caScore ?? 0) + (g.examScore ?? 0),
              grade: g.gradeLetter ?? getGrade((g.caScore ?? 0) + (g.examScore ?? 0))
            }
          })
          setGrades(loaded)
        } else {
          setGrades({})
        }
      })
      .catch(() => setGrades({}))
  }, [selectedStudent, selectedTerm])

  function updateScore(subjectId: string, field: "caScore" | "examScore", value: string) {
    setGrades(prev => {
      const existing = prev[subjectId] ?? { subjectId, caScore: "", examScore: "", total: 0, grade: "-" }
      const ca = field === "caScore" ? Number(value) || 0 : Number(existing.caScore) || 0
      const exam = field === "examScore" ? Number(value) || 0 : Number(existing.examScore) || 0
      const total = ca + exam
      return {
        ...prev,
        [subjectId]: {
          subjectId,
          caScore: field === "caScore" ? value : existing.caScore,
          examScore: field === "examScore" ? value : existing.examScore,
          total,
          grade: getGrade(total)
        }
      }
    })
  }

  async function handleSave() {
    if (!selectedStudent || !selectedTerm) {
      setMsg({ type: "error", text: "Please select a student and term first." })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const gradeList = subjects.map(s => ({
        subjectId: s.id,
        caScore: Number(grades[s.id]?.caScore) || 0,
        examScore: Number(grades[s.id]?.examScore) || 0,
      }))
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent, termId: selectedTerm, grades: gradeList, principalRemarks: remarks })
      })
      if (!res.ok) throw new Error("Failed to save")
      setMsg({ type: "success", text: "✅ Results saved successfully!" })
    } catch {
      setMsg({ type: "error", text: "❌ Could not save. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const studentName = students.find(s => s.id === selectedStudent)?.user?.name ?? ""

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-blue-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-black mb-1">Enter Student Scores</h1>
        <p className="text-blue-200 text-sm">Select class, term and student to enter results.</p>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Term</label>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
            >
              <option value="">-- Select Term --</option>
              {terms.map(t => <option key={t.id} value={t.id}>{t.name} – {t.session}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Student</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
            disabled={!selectedClass}
          >
            <option value="">-- Select Student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.user.name} ({s.admissionNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Scores Table */}
      {selectedStudent && selectedTerm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Scores for <span className="text-[#000080]">{studentName}</span></h2>
            <span className="text-xs text-gray-400 uppercase tracking-widest">CA max: 30 | Exam max: 70</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3 text-left">Subject</th>
                  <th className="px-3 py-3 text-center">CA (0-30)</th>
                  <th className="px-3 py-3 text-center">Exam (0-70)</th>
                  <th className="px-3 py-3 text-center">Total</th>
                  <th className="px-3 py-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map(subject => {
                  const g = grades[subject.id]
                  const total = g?.total ?? 0
                  const grade = g?.grade ?? "-"
                  return (
                    <tr key={subject.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{subject.name}</td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0} max={30}
                          value={g?.caScore ?? ""}
                          onChange={e => updateScore(subject.id, "caScore", e.target.value)}
                          className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min={0} max={70}
                          value={g?.examScore ?? ""}
                          onChange={e => updateScore(subject.id, "examScore", e.target.value)}
                          className="w-16 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-gray-900">{g ? total : "-"}</td>
                      <td className="px-3 py-3 text-center">
                        {g ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColor(grade)}`}>{grade}</span>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Remarks + Save */}
          <div className="px-6 py-4 border-t border-gray-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Class Teacher's Remarks (optional)</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="e.g. Hardworking student, keep it up!"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none"
              />
            </div>

            {msg && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {msg.text}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-[#000080] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Results"}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!selectedStudent || !selectedTerm) && selectedClass && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
          Select a student and term above to enter scores.
        </div>
      )}
      {!selectedClass && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
          Start by selecting a class above.
        </div>
      )}
    </div>
  )
}
