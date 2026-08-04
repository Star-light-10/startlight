"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function AdmissionsDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admissions/list")
      if (res.ok) {
        setApplications(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAction = async (id: string, action: "ACCEPT" | "REJECT") => {
    setProcessingId(id)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to process application")
      }
      
      await fetchApplications()
    } catch (e: any) {
      setErrorMsg(e.message)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admissions Review</h1>
          <p className="text-gray-500 dark:text-gray-400">Review and enroll incoming student applications.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium border border-red-100">
          Error: {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden bg-gray-100">
                          {app.passportPhotoUrl ? (
                            <Image src={app.passportPhotoUrl} alt="Passport" fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">👤</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.firstName} {app.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{app.parentPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.classApplyingFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {app.status === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction(app.id, "ACCEPT")}
                            disabled={processingId === app.id}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md disabled:opacity-50"
                          >
                            {processingId === app.id ? "..." : "Accept & Enroll"}
                          </button>
                          <button
                            onClick={() => handleAction(app.id, "REJECT")}
                            disabled={processingId === app.id}
                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
