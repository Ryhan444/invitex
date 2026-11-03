"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@inviteflix.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Simple session indicator in local storage or cookie for admin portal demo
    if (typeof window !== "undefined") {
      localStorage.setItem("inviteflix_admin_auth", "true");
    }

    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 600);
  };

  const handleQuickDemoAccess = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inviteflix_admin_auth", "true");
    }
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-radial-netflix opacity-40 pointer-events-none" />

      {/* Top Brand Link */}
      <div className="mb-8 z-10 text-center">
        <Link href="/" className="inline-block group">
          <span className="text-3xl sm:text-4xl font-black tracking-tighter text-netflix-red uppercase font-serif">
            INVITE<span className="text-white">FLIX</span>
          </span>
          <span className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">
            Admin Studio Control
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-netflix-dark/90 border border-netflix-border/80 rounded-2xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-netflix-red/20 text-netflix-red flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sign In Admin</h2>
            <p className="text-xs text-gray-400">Masuk untuk mengelola request dan undangan</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-netflix-red text-red-200 text-xs rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-netflix-border rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-netflix-border rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-bold py-3 rounded-lg text-sm tracking-wide shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? "Menghubungkan..." : "Masuk ke Studio Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Quick Demo Login Button */}
        <div className="mt-6 pt-5 border-t border-netflix-border/60">
          <button
            onClick={handleQuickDemoAccess}
            className="w-full bg-neutral-800/80 hover:bg-neutral-800 text-gray-200 hover:text-white border border-neutral-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            1-Click Demo Studio Login (Bypass)
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-300">
          &larr; Kembali ke Landing Page Publik
        </Link>
      </div>
    </div>
  );
}

