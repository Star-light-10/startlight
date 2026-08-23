"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { StarlightLogo } from "@/components/starlight-logo"
import Link from "next/link"

export default function ParentLoginPage() {
  const router = useRouter()
  const [admissionNumber, setAdmissionNumber] = useState("")
  const [surname, setSurname] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await signIn("student-credentials", {
        admissionNumber: admissionNumber.trim(),
        surname: surname.trim(),
        redirect: false,
      })

      if (res?.error) {
        setError("Admission number or surname is incorrect. Please try again.")
        setLoading(false)
        return
      }

      router.push("/parent")
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #020617 0%, #000080 100%)" }}
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <StarlightLogo className="w-16 h-16 mb-4 drop-shadow-2xl" />
          <h1 className="text-white font-black text-3xl tracking-wide">STARLIGHT</h1>
          <p className="text-[#FFA500] text-[10px] tracking-[0.3em] uppercase mt-1">
            Model School — Parent Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-white font-black text-2xl mb-1">Parent Login</h2>
          <p className="text-slate-400 text-sm mb-8 font-light">
            Enter your child's admission number and surname to access the portal.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Admission Number */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                Child's Admission Number
              </label>
              <input
                type="text"
                required
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
                placeholder="e.g. SMS/26/0001"
                autoComplete="off"
                autoFocus
              />
            </div>

            {/* Surname */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                Surname
              </label>
              <input
                type="text"
                required
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
                placeholder="Your surname"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFA500] hover:bg-[#e69400] text-white font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg mt-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Access Parent Portal"}
            </button>
          </form>

          <p className="text-slate-500 text-xs text-center mt-6">
            Having trouble? Contact your school admin.
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6 tracking-widest">
          © 2026 Starlight Model School •{" "}
          <Link
            href="/"
            className="text-[#FFA500] hover:text-white hover:underline transition-colors font-bold"
          >
            Back to Website
          </Link>
        </p>
      </div>
    </div>
  )
}
