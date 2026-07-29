export default function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Teacher!</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Classes</h3>
          <p className="text-3xl font-bold mt-2">4</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Pending Assignments</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
      </div>
    </div>
  )
}
