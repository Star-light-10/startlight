"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { StarlightLogo } from "@/components/starlight-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      
      const emailLower = email.toLowerCase();
      if (emailLower.includes("admin")) {
        router.push("/dashboard");
      } else if (emailLower.includes("student")) {
        router.push("/student");
      } else if (emailLower.includes("parent")) {
        router.push("/parent");
      } else {
        router.push("/teacher");
      }
      
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #020617 0%, #000080 100%)" }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <StarlightLogo className="w-16 h-16 mb-4 drop-shadow-2xl" />
          <h1 className="text-white font-playfair font-black text-3xl tracking-wide">STARLIGHT</h1>
          <p className="text-[#FFA500] text-[10px] tracking-[0.3em] uppercase mt-1">Model School</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-white font-playfair font-black text-2xl mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm mb-8 font-light">Enter your credentials to access your portal.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs text-[#FFA500] hover:text-[#FFD700] hover:underline transition-all">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFA500] hover:bg-[#e69400] text-white font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg mt-4 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to Portal"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-5">Quick Access</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Admin", href: "/dashboard" },
                { label: "Teacher", href: "/teacher" },
                { label: "Student", href: "/student-login" },
                { label: "Parent", href: "/parent-login" },
              ].map((p) => (
                <Link
                  key={p.label}
                  href={p.href}
                  className="py-3 rounded-xl bg-white/5 hover:bg-[#FFA500]/10 border border-white/10 hover:border-[#FFA500]/30 text-slate-300 hover:text-[#FFA500] text-xs font-bold tracking-wider uppercase text-center transition-all"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8 tracking-widest">
          © 2026 Starlight Model School •{" "}
          <Link href="/" className="text-[#FFA500] hover:text-white hover:underline transition-colors font-bold">
            Back to Website
          </Link>
        </p>
      </div>
    </div>
  );
}
