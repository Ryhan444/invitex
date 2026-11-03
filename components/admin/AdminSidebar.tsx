"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Film, Inbox, PlusCircle, ExternalLink, LogOut, Menu, X, Shield } from "lucide-react";
import { useAdminHref } from "./AdminPathContext";

interface AdminSidebarProps {
  adminUser: string;
}

export function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const adminHref = useAdminHref();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/session", { method: "DELETE", credentials: "same-origin" });
    } finally {
      router.replace(adminHref());
      router.refresh();
    }
  };

  const navItems = [
    { label: "All Events", href: adminHref("/dashboard"), icon: Film, exact: true },
    { label: "Client Requests", href: adminHref("/dashboard/requests"), icon: Inbox },
    { label: "New Event", href: adminHref("/dashboard/events/create"), icon: PlusCircle },
  ];

  const isActive = (item: (typeof navItems)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const brand = (
    <Link href={adminHref("/dashboard")} className="flex items-center gap-2">
      <span className="text-xl md:text-2xl font-black tracking-tighter text-netflix-red uppercase font-serif">
        INVITE<span className="text-white">FLIX</span>
      </span>
      <span className="text-[10px] font-bold bg-neutral-800 text-gray-400 px-1.5 py-0.5 rounded border border-neutral-700">
        STUDIO
      </span>
    </Link>
  );

  const body = (
    <>
      <div className="px-5 py-3.5 border-b border-netflix-border/60 bg-neutral-900/40 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-netflix-red/15 text-netflix-red flex items-center justify-center">
          <Shield className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">
            Signed in as
          </span>
          <span className="text-xs font-bold text-white font-mono truncate block">{adminUser}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 mb-2">
          Content
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive(item)
                  ? "bg-netflix-red text-white shadow-md shadow-red-900/30"
                  : "text-gray-400 hover:text-white hover:bg-neutral-800/60"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-netflix-border/80 space-y-1">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/30 transition-colors text-left disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-netflix-dark/95 border-b border-netflix-border/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        {brand}
        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="p-2 rounded-lg bg-neutral-800 text-gray-200 hover:text-white border border-neutral-700"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-netflix-red" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[80vw] bg-netflix-dark border-r border-netflix-border flex flex-col h-full shadow-2xl">
            <div className="p-5 border-b border-netflix-border flex items-center justify-between">
              {brand}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-neutral-900 border border-neutral-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-netflix-dark border-r border-netflix-border/80 flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-netflix-border">
          {brand}
        </div>
        {body}
      </aside>
    </>
  );
}
