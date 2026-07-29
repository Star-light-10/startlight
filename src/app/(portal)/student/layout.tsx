import { ThemeToggle } from "@/components/theme-toggle"

export default function StudentPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-[#000080] dark:text-[#FFA500]">Student Portal</span>
            <nav className="hidden md:flex gap-4">
              <a href="/student" className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</a>
              <a href="/student/results" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Results</a>
              <a href="/student/timetable" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Timetable</a>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
