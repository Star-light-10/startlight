"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { StarlightLogo } from "@/components/starlight-logo"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // ── Auth Guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/student-login")
    }
  }, [status, router])

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading portal...</div>
  }

  const navItems = [
    { name: 'Dashboard', href: '/student' },
    { name: 'School Fees', href: '/student/fees' },
    { name: 'Results', href: '/student/results' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/student" className="flex items-center gap-3">
                <StarlightLogo className="w-8 h-8" />
                <div>
                  <h1 className="font-black text-[#000080] dark:text-white text-sm">STARLIGHT</h1>
                  <p className="text-[10px] text-[#FFA500] font-bold tracking-widest">STUDENT PORTAL</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex space-x-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-bold transition-colors ${
                        isActive 
                          ? 'text-[#000080] dark:text-blue-400' 
                          : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{session?.user?.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Student</p>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: '/student-login' })}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto px-4 py-3 gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`text-xs font-bold whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                isActive 
                  ? 'bg-[#000080] text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
