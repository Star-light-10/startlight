"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function TeacherProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [name, setName] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

  async function handleSaveProfile() {
    if (!name.trim()) {
      setMsg({ type: "error", text: "Name cannot be empty." })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to update")
      }
      await update({ name: name.trim() })
      setMsg({ type: "success", text: "Profile updated successfully!" })
      setEditing(false)
    } catch (e: any) {
      setMsg({ type: "error", text: e.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMsg({ type: "error", text: "Please fill in all password fields." })
      return
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match." })
      return
    }
    if (newPassword.length < 6) {
      setMsg({ type: "error", text: "New password must be at least 6 characters." })
      return
    }
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? "Failed to change password")
      }
      setMsg({ type: "success", text: "Password changed! Please log in again." })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => signOut({ callbackUrl: "/login" }), 2000)
    } catch (e: any) {
      setMsg({ type: "error", text: e.message })
    } finally {
      setSaving(false)
    }
  }

  const initials = (session?.user?.name ?? "T").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#000080] to-blue-800 rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black text-white border-2 border-white/30">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-black">{session?.user?.name ?? "Teacher"}</h1>
          <p className="text-blue-200 text-sm">{session?.user?.email ?? ""}</p>
          <span className="mt-1 inline-block text-[10px] bg-white/20 rounded-full px-3 py-0.5 uppercase tracking-widest font-bold">
            Teacher
          </span>
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* Edit Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Personal Information</h2>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setMsg(null) }}
              className="text-xs font-bold text-[#000080] hover:underline"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
              />
            ) : (
              <p className="text-gray-900 font-medium">{session?.user?.name ?? "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <p className="text-gray-500 text-sm">{session?.user?.email ?? "—"}</p>
            <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed. Contact your admin.</p>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 py-3 bg-[#000080] text-white font-bold text-sm rounded-xl hover:bg-blue-900 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => { setEditing(false); setName(session?.user?.name ?? ""); setMsg(null) }}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-5">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg"
              >
                {showCurrent ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] pr-12"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg"
              >
                {showNew ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]"
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={saving}
          className="w-full mt-6 py-3 bg-[#FFA500] hover:bg-[#e69400] text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-2">Sign Out</h2>
        <p className="text-sm text-gray-500 mb-4">You will be taken back to the login screen.</p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition border border-red-200"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  )
}
