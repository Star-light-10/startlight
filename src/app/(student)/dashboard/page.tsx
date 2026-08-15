"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"

export default function StudentDashboard() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          This is your student portal. You can view your outstanding school fees and check your results here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <Link 
          href="/dashboard/fees" 
          className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-3xl p-6 border border-blue-100 dark:border-blue-800 transition-colors group"
        >
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <span className="text-xl">💳</span>
          </div>
          <h3 className="font-bold text-[#000080] dark:text-blue-400 text-lg mb-1">Pay School Fees</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">View your termly invoices and upload payment receipts.</p>
        </Link>

        <Link 
          href="/dashboard/results" 
          className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-3xl p-6 border border-green-100 dark:border-green-800 transition-colors group"
        >
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="font-bold text-green-700 dark:text-green-400 text-lg mb-1">Check Results</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">View and download your termly report cards.</p>
        </Link>
      </div>
    </div>
  )
}
