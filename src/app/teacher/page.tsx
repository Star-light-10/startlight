import { auth } from "@/auth"
import prisma from "@/lib/db"
import Link from "next/link"

export default async function TeacherDashboard() {
  const session = await auth()
  
  let announcements: any[] = []
  try {
    announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { audience: "ALL" },
          { audience: "STAFF" }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 3
    })
  } catch (error) {
    console.error("Failed to fetch announcements (table might be missing):", error)
  }

  // Fetch today's classes
  let todayClasses: any[] = []
  try {
    if (session?.user?.id) {
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
      })

      if (teacherProfile) {
        const dayOfWeek = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
        
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          todayClasses = await prisma.timeSlot.findMany({
            where: {
              teacherId: teacherProfile.id,
              dayOfWeek: dayOfWeek,
              timetable: {
                term: {
                  isActive: true
                }
              }
            },
            include: {
              subject: true,
              timetable: {
                include: {
                  class: true
                }
              }
            },
            orderBy: {
              startTime: 'asc'
            }
          })
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch timetable:", error)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#000080] to-blue-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Welcome back, {session?.user?.name}!</h1>
          <p className="text-blue-200">Have a great day teaching. Here is what's happening today.</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/teacher/attendance" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                📝
              </div>
              <h3 className="font-bold text-gray-900">Mark Attendance</h3>
              <p className="text-sm text-gray-500 mt-1">Record today's register</p>
            </Link>
            
            <Link href="/teacher/results" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer block">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                📈
              </div>
              <h3 className="font-bold text-gray-900">Enter Scores</h3>
              <p className="text-sm text-gray-500 mt-1">Update terminal results</p>
            </Link>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-[#FFA500]">📅</span> Today's Classes
            </h2>
            {todayClasses.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                No classes scheduled for today.
              </div>
            ) : (
              <div className="space-y-4">
                {todayClasses.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="text-sm font-bold text-gray-900">{slot.startTime}</div>
                      <div className="text-xs text-gray-500">{slot.endTime}</div>
                    </div>
                    <div className="w-1 h-12 bg-blue-100 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{slot.subject?.name || 'Unknown Subject'}</h3>
                      <p className="text-sm text-gray-500">{slot.timetable.class.name} {slot.timetable.class.section || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notice Board */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="text-[#000080]">📌</span> Notice Board
              </h2>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No recent announcements</p>
              ) : (
                announcements.map(notice => (
                  <div key={notice.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{notice.title}</h3>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
