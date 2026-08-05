"use client"

import { useState } from "react"

export default function ContactForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.message) return

    const msg = encodeURIComponent(
      `📩 *New Message from Website*\n\n` +
      `*Name:* ${form.firstName} ${form.lastName}\n` +
      `*Email:* ${form.email || "Not provided"}\n` +
      `*Message:* ${form.message}`
    )
    window.open(`https://wa.me/2348056809200?text=${msg}`, "_blank")
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-green-500 font-bold text-lg">Message Sent!</p>
        <p className="text-gray-500 text-sm mt-1">WhatsApp has been opened with your message.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
        <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
      </div>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]" />
      <textarea name="message" rows={4} required value={form.message} onChange={handleChange} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#000080] resize-none" />
      <button type="submit" className="w-full py-3 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded-xl transition-colors">
        Send Message
      </button>
    </form>
  )
}
