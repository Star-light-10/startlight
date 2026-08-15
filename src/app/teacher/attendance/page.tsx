import { auth } from "@/auth"
import prisma from "@/lib/db"
import AttendanceManager from "./attendance-manager"

export default async function TeacherAttendancePage() {
  const session = await auth()
  
  if (!session?.user?.id) return null

  // Fetch all classes for MVP. In a real system, we'd fetch classes assigned to this teacher
  const classes = await prisma.class.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Attendance Register</h1>
        <p className="text-gray-500 text-sm mt-1">Mark and track daily attendance for your classes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <AttendanceManager classes={classes} userId={session.user.id} />
      </div>
    </div>
  )
}
