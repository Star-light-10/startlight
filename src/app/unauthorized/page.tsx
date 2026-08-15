import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">
          You do not have permission to view this page. If you believe this is a mistake, please contact the school administration.
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-white bg-[#000080] rounded-xl hover:bg-[#000060] transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}
