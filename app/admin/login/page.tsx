"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldAlert } from "lucide-react";
import { useAdminHref } from "@/components/admin/AdminPathContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const adminHref = useAdminHref();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || "Unable to sign in. Please try again.");
        setPassword("");
        setIsLoading(false);
        return;
      }

      router.replace(adminHref("/dashboard"));
      router.refresh();
    } catch {
      setErrorMsg("Unable to reach the server. Please try again.");
      setIsLoading(false);
    }
  };

  const clearError = () => errorMsg && setErrorMsg("");

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-netflix opacity-40 pointer-events-none" />

      <div className="mb-8 z-10 text-center">
        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-netflix-red uppercase font-serif">
          INVITE<span className="text-white">FLIX</span>
        </span>
        <span className="block text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mt-1.5">
          Studio
        </span>
      </div>

      <div className="relative z-10 w-full max-w-sm bg-netflix-dark/95 border border-netflix-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-netflix-red/15 text-netflix-red flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Sign in</h1>
            <p className="text-xs text-gray-400">Authorized personnel only</p>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-red-950/70 border border-netflix-red/60 text-red-200 text-sm rounded-xl mb-5 flex items-start gap-2.5"
          >
            <ShieldAlert className="w-4 h-4 text-netflix-red flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="username"
                type="text"
                required
                maxLength={100}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
                className="w-full bg-neutral-900 border border-netflix-border rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                required
                maxLength={200}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className="w-full bg-neutral-900 border border-netflix-border rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-netflix-red hover:bg-netflix-redHover active:scale-[0.99] text-white font-bold py-3 rounded-xl text-sm tracking-wide shadow-lg shadow-red-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 !mt-6"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
