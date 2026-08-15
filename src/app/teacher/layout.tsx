import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Double check role
  if (session.user.role !== "TEACHER" && session.user.role !== "SUPER_ADMIN") {
    redirect("/login?error=unauthorized")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FFA500] rounded-lg flex items-center justify-center text-white font-black text-xl">
            ★
          </div>
          <span className="font-bold text-[#000080]">Starlight Teacher</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline-block">
            {session.user.name}
          </span>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[#000080] font-bold shadow-sm">
            {session.user.name?.[0] || "T"}
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <aside className="w-64 border-r border-gray-200 bg-white hidden lg:block p-4">
          <nav className="space-y-1">
            <Link href="/teacher" className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#000080]/5 text-[#000080] font-semibold text-sm transition-colors">
              <span>📊</span> Dashboard
            </Link>
            <Link href="/teacher/classes" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
              <span>🏫</span> My Classes
            </Link>
            <Link href="/teacher/attendance" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
              <span>📝</span> Attendance
            </Link>
            <Link href="/teacher/results" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium text-sm transition-colors">
              <span>📈</span> Results & Grades
            </Link>
          </nav>

          <div className="mt-8">
            <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-colors">
              <span>🚪</span> Sign Out
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
