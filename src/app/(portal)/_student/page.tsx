export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Student!</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Current GPA</h3>
          <p className="text-3xl font-bold mt-2">4.5</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Attendance</h3>
          <p className="text-3xl font-bold mt-2">98%</p>
        </div>
      </div>
    </div>
  )
}
