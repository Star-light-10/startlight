"use client"

import { useState, useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Class = { id: string; name: string; section?: string }
type Term = { id: string; name: string; isActive: boolean }
type Subject = { id: string; name: string; code?: string }
type Student = { id: string; name: string; admissionNumber: string; class: string }

type GradeRow = {
  subjectId: string
  subjectName: string
  caScore: string
  examScore: string
}

type ReportGrade = {
  id: string
  subjectId: string
  subject: { id: string; name: string }
  caScore: number
  examScore: number
  totalScore: number
  gradeLetter: string
  remarks: string
}

type ReportCard = {
  id: string
  studentId: string
  termId: string
  totalScore: number | null
  average: number | null
  principalRemarks: string | null
  student: {
    id: string
    admissionNumber: string
    user: { name: string }
    class: { name: string }
  }
  term: { id: string; name: string }
  grades: ReportGrade[]
}

// ─── Grade Helpers ─────────────────────────────────────────────────────────────

function computeClientGrade(total: number) {
  if (total >= 70) return { letter: "A", remarks: "Excellent" }
  if (total >= 60) return { letter: "B", remarks: "Very Good" }
  if (total >= 50) return { letter: "C", remarks: "Good" }
  if (total >= 40) return { letter: "D", remarks: "Pass" }
  return { letter: "F", remarks: "Fail" }
}

const gradePill: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  F: "bg-red-100 text-red-800",
}

// ─── Print Report Card Component ───────────────────────────────────────────────

function PrintableCard({
  card,
  position,
  classSize,
}: {
  card: ReportCard
  position: number
  classSize: number
}) {
  return (
    <div id="printable-report-card" className="bg-white p-8 max-w-3xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center border-b-4 border-[#000080] pb-4 mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-14 h-14 bg-[#000080] rounded-full flex items-center justify-center text-white font-black text-xl">
            S
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#000080] uppercase tracking-widest">
              STARLIGHT SCHOOL
            </h1>
            <p className="text-xs text-gray-500">Excellence in Education</p>
          </div>
        </div>
        <h2 className="text-lg font-bold text-[#FFA500] mt-2 uppercase tracking-wider">
          Student Report Card
        </h2>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-bold text-gray-500 w-32">Student Name:</span>
            <span className="font-semibold text-gray-900">{card.student.user.name}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-gray-500 w-32">Admission No.:</span>
            <span className="font-mono font-bold text-[#000080]">{card.student.admissionNumber}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-gray-500 w-32">Class:</span>
            <span className="font-semibold text-gray-900">{card.student.class.name}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-bold text-gray-500 w-32">Term:</span>
            <span className="font-semibold text-gray-900">{card.term.name}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-gray-500 w-32">Position:</span>
            <span className="font-bold text-[#000080]">
              {position}<sup>{["st","nd","rd"][position-1] || "th"}</sup> of {classSize}
            </span>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <table className="w-full border-collapse text-sm mb-6">
        <thead>
          <tr className="bg-[#000080] text-white">
            <th className="border border-blue-900 px-3 py-2 text-left">Subject</th>
            <th className="border border-blue-900 px-3 py-2 text-center">CA (30)</th>
            <th className="border border-blue-900 px-3 py-2 text-center">Exam (70)</th>
            <th className="border border-blue-900 px-3 py-2 text-center">Total (100)</th>
            <th className="border border-blue-900 px-3 py-2 text-center">Grade</th>
            <th className="border border-blue-900 px-3 py-2 text-center">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {card.grades.map((g, i) => (
            <tr key={g.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-200 px-3 py-2 font-semibold">{g.subject.name}</td>
              <td className="border border-gray-200 px-3 py-2 text-center">{g.caScore}</td>
              <td className="border border-gray-200 px-3 py-2 text-center">{g.examScore}</td>
              <td className="border border-gray-200 px-3 py-2 text-center font-bold">{g.totalScore}</td>
              <td className="border border-gray-200 px-3 py-2 text-center">
                <span className="font-black text-base">{g.gradeLetter}</span>
              </td>
              <td className="border border-gray-200 px-3 py-2 text-center text-gray-600">{g.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-[#000080]/5 rounded-xl border border-[#000080]/20">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Marks</p>
          <p className="text-2xl font-black text-[#000080]">{card.totalScore?.toFixed(0) ?? "—"}</p>
        </div>
        <div className="text-center border-x border-[#000080]/20">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Average</p>
          <p className="text-2xl font-black text-[#000080]">{card.average?.toFixed(1) ?? "—"}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</p>
          <p className="text-2xl font-black text-[#FFA500]">
            {card.average != null ? computeClientGrade(card.average).letter : "—"}
          </p>
        </div>
      </div>

      {/* Principal's Remarks */}
      <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Principal&apos;s Remarks</p>
        <p className="text-sm text-gray-700 min-h-[40px]">
          {card.principalRemarks || "Keep up the good work!"}
        </p>
      </div>

      {/* Signature Lines */}
      <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="border-b-2 border-gray-400 mb-2 h-10" />
          <p className="text-xs font-bold text-gray-500">Class Teacher&apos;s Signature</p>
        </div>
        <div className="text-center">
          <div className="border-b-2 border-gray-400 mb-2 h-10" />
          <p className="text-xs font-bold text-gray-500">Principal&apos;s Signature</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [tab, setTab] = useState<"enter" | "view">("enter")

  // Shared selectors
  const [classes, setClasses] = useState<Class[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedTermId, setSelectedTermId] = useState("")

  // Enter Results
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [gradeRows, setGradeRows] = useState<GradeRow[]>([])
  const [principalRemarks, setPrincipalRemarks] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // View Report Cards
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [loadingCards, setLoadingCards] = useState(false)
  const [printCard, setPrintCard] = useState<ReportCard | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  // ── Load classes, terms, subjects on mount ──
  useEffect(() => {
    fetch("/api/academics/classes")
      .then((r) => r.json())
      .then(setClasses)
      .catch(() => {})

    fetch("/api/academics/terms")
      .then((r) => r.json())
      .then((data: Term[]) => {
        setTerms(data)
        const active = data.find((t) => t.isActive)
        if (active) setSelectedTermId(active.id)
      })
      .catch(() => {})

    fetch("/api/academics/subjects")
      .then((r) => r.json())
      .then((data: Subject[]) => {
        setSubjects(data)
      })
      .catch(() => {})
  }, [])

  // ── Load students when class changes ──
  useEffect(() => {
    if (!selectedClassId) {
      setStudents([])
      setSelectedStudentId("")
      return
    }
    fetch(`/api/students?classId=${selectedClassId}`)
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {})
  }, [selectedClassId])

  // ── Init grade rows when subjects load ──
  useEffect(() => {
    setGradeRows(
      subjects.map((s) => ({
        subjectId: s.id,
        subjectName: s.name,
        caScore: "",
        examScore: "",
      }))
    )
  }, [subjects])

  // ── Pre-fill grade rows if student already has a report card ──
  useEffect(() => {
    if (!selectedStudentId || !selectedTermId) return
    setSaveSuccess(false)
    setSaveError(null)
    fetch(`/api/results?studentId=${selectedStudentId}&termId=${selectedTermId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((card: ReportCard | null) => {
        if (!card) return
        setPrincipalRemarks(card.principalRemarks ?? "")
        setGradeRows((prev) =>
          prev.map((row) => {
            const existing = card.grades.find((g) => g.subjectId === row.subjectId)
            if (existing) {
              return {
                ...row,
                caScore: String(existing.caScore),
                examScore: String(existing.examScore),
              }
            }
            return row
          })
        )
      })
      .catch(() => {})
  }, [selectedStudentId, selectedTermId])

  // ── Compute totals client-side ──
  function computeTotal(row: GradeRow) {
    const ca = Math.max(0, Math.min(30, parseFloat(row.caScore) || 0))
    const exam = Math.max(0, Math.min(70, parseFloat(row.examScore) || 0))
    return ca + exam
  }

  function updateRow(idx: number, field: "caScore" | "examScore", value: string) {
    setGradeRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))
  }

  // ── Save results ──
  async function handleSaveResults() {
    if (!selectedStudentId || !selectedTermId) return
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)
    try {
      const payload = {
        studentId: selectedStudentId,
        termId: selectedTermId,
        principalRemarks: principalRemarks || undefined,
        grades: gradeRows
          .filter((r) => r.caScore !== "" || r.examScore !== "")
          .map((r) => ({
            subjectId: r.subjectId,
            caScore: parseFloat(r.caScore) || 0,
            examScore: parseFloat(r.examScore) || 0,
          })),
      }
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save results")
      setSaveSuccess(true)
    } catch (e: any) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Load report cards ──
  async function handleLoadResults() {
    if (!selectedClassId || !selectedTermId) return
    setLoadingCards(true)
    try {
      const res = await fetch(`/api/results?classId=${selectedClassId}&termId=${selectedTermId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReportCards(data)
    } catch {
      setReportCards([])
    } finally {
      setLoadingCards(false)
    }
  }

  // ── Position table ──
  const rankedCards = [...reportCards].sort((a, b) => (b.average ?? 0) - (a.average ?? 0))

  // ── Print ──
  function handlePrint(card: ReportCard) {
    setPrintCard(card)
    setTimeout(() => window.print(), 200)
  }

  // ── Shared selectors UI ──
  const SelectorBar = (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-bold text-gray-500 mb-1">Select Class</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
        >
          <option value="">— Choose class —</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}{c.section ? ` (${c.section})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-bold text-gray-500 mb-1">Select Term</label>
        <select
          value={selectedTermId}
          onChange={(e) => setSelectedTermId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
        >
          <option value="">— Choose term —</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}{t.isActive ? " (Current)" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Print overlay – hidden on screen, shown only when printing ── */}
      {printCard && (
        <div
          ref={printRef}
          className="hidden print:block fixed inset-0 z-[9999] bg-white"
          aria-hidden="true"
        >
          <PrintableCard
            card={printCard}
            position={rankedCards.findIndex((c) => c.id === printCard.id) + 1 || 1}
            classSize={rankedCards.length || 1}
          />
        </div>
      )}

      {/* ── Print style injected globally ── */}
      <style jsx global>{`
        @media print {
          body > * { display: none !important; }
          body > div[aria-hidden="true"] { display: block !important; }
        }
      `}</style>

      <div className="space-y-6 print:hidden">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Results & Report Cards</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Enter student scores and generate printable report cards.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          {(["enter", "view"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === t
                  ? "bg-[#000080] text-white shadow"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              {t === "enter" ? "✏️ Enter Results" : "🖨️ View & Print"}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Enter Results ── */}
        {tab === "enter" && (
          <div className="space-y-5">
            {SelectorBar}

            {/* Student selector */}
            {selectedClassId && selectedTermId && (
              <div className="max-w-sm">
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                >
                  <option value="">— Choose student —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.admissionNumber} – {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Grades table */}
            {selectedStudentId && selectedClassId && selectedTermId && subjects.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h2 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                    Score Entry — {students.find((s) => s.id === selectedStudentId)?.name}
                  </h2>
                  <span className="text-xs text-gray-500">CA max: 30 | Exam max: 70</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">CA Score (0–30)</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Exam Score (0–70)</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {gradeRows.map((row, idx) => {
                        const total = computeTotal(row)
                        const { letter } = computeClientGrade(total)
                        const hasEntry = row.caScore !== "" || row.examScore !== ""
                        return (
                          <tr key={row.subjectId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                              {row.subjectName}
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="number"
                                min={0}
                                max={30}
                                step="0.5"
                                value={row.caScore}
                                onChange={(e) => updateRow(idx, "caScore", e.target.value)}
                                placeholder="0"
                                className="w-20 mx-auto block text-center px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                              />
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="number"
                                min={0}
                                max={70}
                                step="0.5"
                                value={row.examScore}
                                onChange={(e) => updateRow(idx, "examScore", e.target.value)}
                                placeholder="0"
                                className="w-20 mx-auto block text-center px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                              />
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={`text-sm font-bold ${hasEntry ? "text-gray-900 dark:text-white" : "text-gray-300"}`}>
                                {hasEntry ? total.toFixed(1) : "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              {hasEntry ? (
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${gradePill[letter] ?? "bg-gray-100 text-gray-800"}`}>
                                  {letter}
                                </span>
                              ) : (
                                <span className="text-gray-300 text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Principal Remarks */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Principal&apos;s Remarks <span className="font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={principalRemarks}
                    onChange={(e) => setPrincipalRemarks(e.target.value)}
                    rows={2}
                    placeholder="e.g. Excellent performance. Keep it up!"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    {saveSuccess && (
                      <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1.5">
                        ✓ Results saved successfully!
                      </span>
                    )}
                    {saveError && (
                      <span className="text-red-600 text-sm font-bold">{saveError}</span>
                    )}
                  </div>
                  <button
                    onClick={handleSaveResults}
                    disabled={saving}
                    className="px-5 py-2 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors disabled:bg-gray-400"
                  >
                    {saving ? "Saving..." : "💾 Save Results"}
                  </button>
                </div>
              </div>
            )}

            {!selectedClassId || !selectedTermId ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center text-gray-400 text-sm">
                Select a class and term above to begin entering results.
              </div>
            ) : !selectedStudentId ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center text-gray-400 text-sm">
                Select a student above to enter their scores.
              </div>
            ) : null}
          </div>
        )}

        {/* ── Tab 2: View & Print ── */}
        {tab === "view" && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                >
                  <option value="">— Choose class —</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.section ? ` (${c.section})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-bold text-gray-500 mb-1">Select Term</label>
                <select
                  value={selectedTermId}
                  onChange={(e) => setSelectedTermId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
                >
                  <option value="">— Choose term —</option>
                  {terms.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}{t.isActive ? " (Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleLoadResults}
                disabled={!selectedClassId || !selectedTermId || loadingCards}
                className="px-5 py-2 bg-[#000080] hover:bg-[#000066] text-white text-sm font-bold rounded-xl transition-colors disabled:bg-gray-400"
              >
                {loadingCards ? "Loading..." : "Load Results"}
              </button>
            </div>

            {/* Results table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              {rankedCards.length === 0 ? (
                <div className="py-20 text-center text-gray-400 text-sm">
                  {loadingCards
                    ? "Loading report cards..."
                    : "No report cards found. Select class + term and click Load Results."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pos.</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Adm. No.</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Average</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Subjects</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {rankedCards.map((card, idx) => {
                        const avg = card.average ?? 0
                        const { letter } = computeClientGrade(avg)
                        const pos = idx + 1
                        const suffix = ["st", "nd", "rd"][pos - 1] ?? "th"
                        return (
                          <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="px-5 py-4 text-sm font-black text-[#000080] dark:text-blue-400">
                              {pos}{suffix}
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                              {card.student.user.name}
                            </td>
                            <td className="px-5 py-4 font-mono text-sm text-[#000080] dark:text-blue-400 font-bold">
                              {card.student.admissionNumber}
                            </td>
                            <td className="px-5 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {card.totalScore?.toFixed(0) ?? "—"}
                            </td>
                            <td className="px-5 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {avg.toFixed(1)}%
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${gradePill[letter] ?? "bg-gray-100 text-gray-800"}`}>
                                {letter}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-center text-sm text-gray-500">
                              {card.grades.length}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => handlePrint(card)}
                                className="px-3 py-1.5 bg-[#FFA500] hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 mx-auto"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
