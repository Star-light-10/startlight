export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, Parent!</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Pending Fees</h3>
          <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">₦150,000</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
          <p className="text-lg font-medium mt-2">PTA Meeting (Next Friday)</p>
        </div>
      </div>
    </div>
  )
}
