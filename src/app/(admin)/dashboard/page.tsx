"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Stats = {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  rejectedApplications: number
  totalStudents: number
}

function StatCard({
  label,
  value,
  icon,
  color,
  href,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  color: string
  href?: string
}) {
  const content = (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      {href && (
        <p className="text-xs text-[#000080] dark:text-blue-400 font-semibold mt-4 group-hover:underline">
          View all →
        </p>
      )}
    </div>
  )

  return href ? <Link href={href}>{content}</Link> : content
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admissions/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayValue = (val?: number) =>
    loading ? "..." : (val ?? 0).toLocaleString()

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Welcome back 👋</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Here&apos;s what&apos;s happening at Starlight Model School today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total Applications"
          value={displayValue(stats?.totalApplications)}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          href="/dashboard/admissions"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Pending Review"
          value={displayValue(stats?.pendingApplications)}
          color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          href="/dashboard/admissions"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Accepted"
          value={displayValue(stats?.acceptedApplications)}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          href="/dashboard/admissions"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Rejected"
          value={displayValue(stats?.rejectedApplications)}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          href="/dashboard/admissions"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Enrolled Students"
          value={displayValue(stats?.totalStudents)}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          href="/students"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/admissions"
            className="flex items-center gap-3 p-4 bg-[#000080] hover:bg-[#000066] text-white rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <p className="font-bold text-sm">Review Applications</p>
              <p className="text-blue-200 text-xs">Accept or reject pending</p>
            </div>
          </Link>
          <Link
            href="/admissions"
            target="_blank"
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#000080] dark:hover:border-blue-500 rounded-xl transition-colors shadow-sm group"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-[#000080] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Admissions Form</p>
              <p className="text-gray-400 text-xs">Open public form</p>
            </div>
          </Link>
          <Link
            href="/dashboard/finance"
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#000080] dark:hover:border-blue-500 rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-[#000080] dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Finance Report</p>
              <p className="text-gray-400 text-xs">View fees &amp; payments</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
