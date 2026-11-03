"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film,
  Inbox,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
  Shield,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState("ryhan444");

  // Client-side authentication guard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("inviteflix_admin_auth") === "true";
      const hasCookie = document.cookie.includes("inviteflix_admin_auth=ryhan444_authenticated");
      if (!isAuth || !hasCookie) {
        router.push("/admin/login");
      }
      const savedUser = localStorage.getItem("inviteflix_admin_user");
      if (savedUser) setAdminUser(savedUser);
    }
  }, [router]);

  // Close mobile drawer when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("inviteflix_admin_auth");
      localStorage.removeItem("inviteflix_admin_user");
      document.cookie = "inviteflix_admin_auth=; path=/; max-age=0; SameSite=Lax";
    }
    router.push("/admin/login");
  };

  const navItems = [
    {
      label: "Semua Events",
      href: "/admin/dashboard",
      icon: Film,
      exact: true,
    },
    {
      label: "User Requests",
      href: "/admin/dashboard/requests",
      icon: Inbox,
    },
    {
      label: "Buat Event Baru",
      href: "/admin/dashboard/events/create",
      icon: PlusCircle,
    },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar (visible only on < md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-netflix-dark/95 border-b border-netflix-border/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter text-netflix-red uppercase font-serif">
            INVITE<span className="text-white">FLIX</span>
          </span>
          <span className="text-[10px] font-bold bg-neutral-800 text-gray-300 px-1.5 py-0.5 rounded border border-neutral-700">
            STUDIO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-800 text-gray-200 hover:text-white border border-neutral-700 active:scale-95 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-netflix-red" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-netflix-dark border-r border-netflix-border flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header in Drawer */}
            <div className="p-5 border-b border-netflix-border flex items-center justify-between">
              <div>
                <span className="text-xl font-black tracking-tighter text-netflix-red uppercase font-serif">
                  INVITE<span className="text-white">FLIX</span>
                </span>
                <span className="block text-[10px] text-gray-400 font-semibold tracking-wider mt-0.5">
                  ADMIN STUDIO
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-neutral-900 border border-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Admin User Badge */}
            <div className="px-5 py-3 bg-neutral-900/60 border-b border-netflix-border/50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-netflix-red/20 text-netflix-red flex items-center justify-center text-xs font-bold">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                  Logged in as
                </span>
                <span className="text-xs font-bold text-white font-mono">{adminUser}</span>
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
                Manajemen Konten
              </div>
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-netflix-red text-white shadow-md shadow-red-900/30"
                        : "text-gray-300 hover:text-white hover:bg-neutral-800/70"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-netflix-border/80 space-y-2 mt-auto">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <span>Lihat Publik Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile, sticky on md and up) */}
      <aside className="hidden md:flex w-64 bg-netflix-dark border-r border-netflix-border/80 flex-col flex-shrink-0 min-h-screen text-gray-300 sticky top-0 h-screen">
        {/* Brand */}
        <div className="p-6 border-b border-netflix-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-netflix-red uppercase font-serif">
              INVITE<span className="text-white">FLIX</span>
            </span>
            <span className="text-[10px] font-bold bg-neutral-800 text-gray-400 px-1.5 py-0.5 rounded border border-neutral-700">
              STUDIO
            </span>
          </Link>
        </div>

        {/* User Info Pill */}
        <div className="px-5 py-3 border-b border-netflix-border/60 bg-neutral-900/40 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-netflix-red/20 text-netflix-red flex items-center justify-center text-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
              Admin Aktif
            </span>
            <span className="text-xs font-bold text-white font-mono">{adminUser}</span>
          </div>
        </div>

        {/* Nav List */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
            Manajemen Konten
          </div>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-netflix-red text-white shadow-md shadow-red-900/30"
                    : "text-gray-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-netflix-border/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <span>Lihat Publik Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Studio</span>
          </button>
        </div>
      </aside>
    </>
  );
}
