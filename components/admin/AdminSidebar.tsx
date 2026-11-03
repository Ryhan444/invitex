"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film,
  Layers,
  Inbox,
  PlusCircle,
  ExternalLink,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("inviteflix_admin_auth");
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
    <aside className="w-64 bg-netflix-dark border-r border-netflix-border/80 flex flex-col flex-shrink-0 min-h-screen text-gray-300">
      {/* Brand */}
      <div className="p-6 border-b border-netflix-border">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-netflix-red uppercase font-serif">
            INVITE<span className="text-white">FLIX</span>
          </span>
          <span className="text-[10px] font-bold bg-neutral-800 text-gray-400 px-1.5 py-0.5 rounded border border-neutral-700">
            STUDIO
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-4 py-6 space-y-1.5">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-netflix-red text-white shadow-md shadow-red-900/30"
                  : "text-gray-400 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
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
  );
}

