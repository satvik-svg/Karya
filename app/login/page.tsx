"use client";

import { useState } from "react";
import { loginUser } from "@/lib/actions/auth";
import Link from "next/link";
import { LogIn, Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await loginUser(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(#4f4f4f 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* Glow blobs */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#6B7A2A]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#4A5420]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[420px] px-4 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.png" alt="Logo" width={40} height={40} className="rounded-xl object-cover" />
        </div>

        <div className="bg-[#111111] border border-white/8 rounded-2xl p-8 shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Sign in to your workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm rounded-xl p-3 mb-6 border border-red-500/20 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#6B7A2A] focus:border-[#6B7A2A] outline-none transition text-[15px] text-white placeholder:text-gray-600"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#6B7A2A] focus:border-[#6B7A2A] outline-none transition text-[15px] text-white placeholder:text-gray-600"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-[13px] text-gray-500 hover:text-[#8B9A35] transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6B7A2A] hover:bg-[#7A8B30] text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-[15px] shadow-lg shadow-[#2A3010]/40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-7 mb-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8"></div>
            <span className="text-[11px] uppercase tracking-wider font-medium text-gray-600">Or continue with</span>
            <div className="flex-1 h-px bg-white/8"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button type="button" className="flex items-center justify-center py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 21.444c-1.343 1.143-2.776 1.143-4.008.041-1.569-1.449-3.982-1.449-5.531 0-1.364 1.265-2.602 1.122-3.886-.143-4.65-4.63-6.139-12.26-2.182-16.913 1.652-1.938 3.845-2.59 5.66-2.59 1.631 0 3.141.693 4.181.693 1.06 0 2.835-.795 4.772-.795 2.141 0 4.16.856 5.445 2.508-4.67 2.549-3.946 9.16.938 11.058-1.081 2.753-2.855 5.14-5.389 6.141zm-4.181-19.607c-.041-2.406 1.917-4.405 4.283-4.834.408 2.549-1.815 4.752-4.283 4.834z" />
              </svg>
            </button>
          </div>

          <p className="text-center text-[13px] text-gray-600 mt-7">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#8B9A35] hover:text-[#6B7A2A] font-semibold transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
