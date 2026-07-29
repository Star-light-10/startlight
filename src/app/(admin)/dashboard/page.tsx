export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Sample Cards */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</h3>
        <p className="text-3xl font-bold mt-2">1,234</p>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</h3>
        <p className="text-3xl font-bold mt-2">56</p>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Classes</h3>
        <p className="text-3xl font-bold mt-2">24</p>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Fees</h3>
        <p className="text-3xl font-bold mt-2">₦450,000</p>
      </div>
    </div>
  )
}
