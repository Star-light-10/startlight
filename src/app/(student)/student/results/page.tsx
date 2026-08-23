"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Grade {
  id: string
  subject: { name: string; code?: string }
  caScore: number | null
  examScore: number | null
  totalScore: number | null
  gradeLetter: string | null
  remarks: string | null
}

interface ReportCard {
  id: string
  totalScore: number | null
  average: number | null
  principalRemarks: string | null
  term: { id: string; name: string; startDate: string; endDate: string }
  grades: Grade[]
}

interface Term {
  id: string
  name: string
}

interface ResultsData {
  reportCard: ReportCard | null
  terms: Term[]
  currentTermId: string | null
}

function gradeColor(letter: string | null) {
  switch (letter) {
    case "A": return "text-green-600 bg-green-50"
    case "B": return "text-blue-600 bg-blue-50"
    case "C": return "text-yellow-600 bg-yellow-50"
    case "D": return "text-orange-600 bg-orange-50"
    case "F": return "text-red-600 bg-red-50"
    default:  return "text-gray-500 bg-gray-50"
  }
}

export default function StudentResultsPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ResultsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null)

  const fetchResults = async (termId?: string) => {
    setIsLoading(true)
    try {
      const url = termId ? `/api/student/results?termId=${termId}` : "/api/student/results"
      const res = await fetch(url)
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setSelectedTermId(json.currentTermId)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleTermChange = (termId: string) => {
    setSelectedTermId(termId)
    fetchResults(termId)
  }

  const card = data?.reportCard

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Results</h1>
          <p className="text-gray-500 dark:text-gray-400">View your termly academic report card.</p>
        </div>

        {/* Term selector */}
        {data && data.terms.length > 0 && (
          <select
            value={selectedTermId ?? ""}
            onChange={(e) => handleTermChange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
          >
            {data.terms.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-500">Loading your results...</div>
      ) : !card ? (
        /* No results published yet */
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <span className="text-5xl mb-4 block">📋</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Results Yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Your results for this term have not been published yet. Check back later or contact your class teacher.
          </p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="bg-gradient-to-br from-[#000080] to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mb-1">
              {card.term.name}
            </p>
            <h2 className="text-xl font-black mb-4">{session?.user?.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-black">
                  {card.average !== null ? card.average.toFixed(1) : "—"}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-bold uppercase tracking-wider">Average</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-black">{card.grades.length}</p>
                <p className="text-xs text-blue-200 mt-1 font-bold uppercase tracking-wider">Subjects</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                <p className="text-3xl font-black">
                  {card.grades.filter((g) => g.gradeLetter === "A").length}
                </p>
                <p className="text-xs text-blue-200 mt-1 font-bold uppercase tracking-wider">A Grades</p>
              </div>
            </div>
          </div>

          {/* Grades table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-gray-900 dark:text-white">Subject Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">CA (30)</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Exam (70)</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {card.grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {grade.subject.name}
                        {grade.subject.code && (
                          <span className="ml-2 text-[10px] text-gray-400 font-normal">{grade.subject.code}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-mono font-bold">
                        {grade.caScore ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700 dark:text-gray-300 font-mono font-bold">
                        {grade.examScore ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-center font-black text-gray-900 dark:text-white text-base">
                        {grade.totalScore ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase ${gradeColor(grade.gradeLetter)}`}>
                          {grade.gradeLetter ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 text-xs hidden sm:table-cell">
                        {grade.remarks ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Principal's remarks */}
          {card.principalRemarks && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                Principal&apos;s Remarks
              </p>
              <p className="text-gray-800 dark:text-gray-200 font-medium italic">&quot;{card.principalRemarks}&quot;</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
