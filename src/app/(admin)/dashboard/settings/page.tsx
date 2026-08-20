"use client"

import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({ name: "", address: "", phone: "", email: "", domain: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings({
          name: data.name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          domain: data.domain || "",
        })
        setIsLoading(false)
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const field = (label: string, key: keyof typeof settings, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={settings[key]}
        onChange={e => setSettings({ ...settings, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#000080] text-sm"
      />
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">School Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Edit your school's name, contact details, and other information.</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading settings…</div>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
          {field("School Name", "name", "text", "e.g. Starlight Model School")}
          {field("Address", "address", "text", "e.g. 12 School Road, Kano")}
          {field("Phone Number", "phone", "tel", "e.g. 08012345678")}
          {field("Email Address", "email", "email", "school@example.com")}
          {field("Website / Domain", "domain", "text", "e.g. starlightschool.com")}

          <div className="pt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving…" : "Save Settings"}
            </button>
            {saved && (
              <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                ✓ Saved successfully
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
