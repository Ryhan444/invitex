"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If already authenticated, redirect directly
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("inviteflix_admin_auth") === "true";
      const hasCookie = document.cookie.includes("inviteflix_admin_auth=ryhan444_authenticated");
      if (isAuth && hasCookie) {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const cleanUsername = username.trim();
    const cleanPassword = password;

    // Strict admin credentials verification
    if (cleanUsername === "ryhan444" && cleanPassword === "Harimau021") {
      if (typeof window !== "undefined") {
        // Set persistent cookie for Next.js middleware
        document.cookie = "inviteflix_admin_auth=ryhan444_authenticated; path=/; max-age=86400; SameSite=Lax";
        // Set local storage session
        localStorage.setItem("inviteflix_admin_auth", "true");
        localStorage.setItem("inviteflix_admin_user", "ryhan444");
      }

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 400);
    } else {
      setIsLoading(false);
      setErrorMsg("Username atau password yang Anda masukkan salah. Akses ditolak.");
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col justify-center items-center px-4 py-8 sm:p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-radial-netflix opacity-40 pointer-events-none" />

      {/* Top Brand Link */}
      <div className="mb-6 sm:mb-8 z-10 text-center">
        <Link href="/" className="inline-block group">
          <span className="text-3xl sm:text-4xl font-black tracking-tighter text-netflix-red uppercase font-serif">
            INVITE<span className="text-white">FLIX</span>
          </span>
          <span className="block text-[11px] sm:text-xs uppercase tracking-widest text-gray-400 font-semibold mt-1">
            Studio Control Room
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-netflix-dark/95 border border-netflix-border/80 rounded-2xl p-6 sm:p-9 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-netflix-border/60">
          <div className="w-10 h-10 rounded-xl bg-netflix-red/20 text-netflix-red flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Sign In Admin</h2>
            <p className="text-xs text-gray-400">Masuk untuk mengelola request dan undangan</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-netflix-red/80 text-red-200 text-xs sm:text-sm rounded-xl mb-5 flex items-start gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 text-netflix-red flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Username Admin
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                placeholder="Masukkan username admin"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full bg-neutral-900 border border-netflix-border rounded-xl pl-10 pr-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
              />
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5 sm:top-4" />
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
                autoComplete="current-password"
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full bg-neutral-900 border border-netflix-border rounded-xl pl-10 pr-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5 sm:top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-netflix-red hover:bg-netflix-redHover active:scale-[0.99] text-white font-bold py-3.5 rounded-xl text-sm sm:text-base tracking-wide shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              <>
                <span>Masuk ke Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white py-2 px-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Publik</span>
        </Link>
      </div>
    </div>
  );
}
