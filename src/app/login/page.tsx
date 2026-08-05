"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Basic routing logic based on email for demo purposes
      if (email.includes("admin")) {
        router.push("/dashboard");
      } else if (email.includes("teacher")) {
        router.push("/teacher");
      } else if (email.includes("student")) {
        router.push("/student");
      } else if (email.includes("parent")) {
        router.push("/parent");
      } else {
        // If no matching role is found, show the error the user expects
        setError("Account not active or invalid credentials. Please contact the administrator.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #000080 0%, #0a0a50 100%)" }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFA500]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FFD700] flex items-center justify-center shadow-2xl shadow-[#FFA500]/40 mx-auto mb-4">
            <span className="text-white font-black text-3xl">★</span>
          </div>
          <h1 className="text-white font-black text-2xl">STARLIGHT MODEL SCHOOL</h1>
          <p className="text-blue-200 text-sm mt-1">Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-black text-xl mb-2">Welcome Back</h2>
          <p className="text-blue-200 text-sm mb-6">Enter your credentials to access your portal</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#FFA500] hover:text-[#FFD700]">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FFA500] hover:bg-[#e69400] text-white font-black rounded-xl transition-colors shadow-lg shadow-[#FFA500]/30 mt-2 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to Portal"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-blue-200 text-xs text-center mb-4">Or select your portal</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Admin", href: "/dashboard" },
                { label: "Teacher", href: "/teacher" },
                { label: "Student", href: "/student" },
                { label: "Parent", href: "/parent" },
              ].map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold text-center transition-colors"
                >
                  {p.label} Portal
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          © 2026 Starlight Model School •{" "}
          <Link href="/" className="text-[#FFA500] hover:underline">
            Back to Website
          </Link>
        </p>
      </div>
    </div>
  );
}
