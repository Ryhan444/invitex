"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Film, Sparkles, Send, ShieldCheck, Menu, X } from "lucide-react";

interface NavbarProps {
  customTitle?: string;
  isInvitation?: boolean;
}

export function Navbar({ customTitle, isInvitation = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-netflix-black/95 backdrop-blur-md shadow-2xl py-3 border-b border-netflix-border/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl sm:text-3xl font-black tracking-tighter text-netflix-red uppercase font-serif drop-shadow-md group-hover:scale-105 transition-transform duration-200">
            INVITE<span className="text-white">FLIX</span>
          </span>
          {customTitle && (
            <span className="hidden md:inline-block ml-3 px-2.5 py-0.5 rounded text-xs font-semibold bg-netflix-dark text-netflix-lightGray border border-netflix-border">
              {customTitle}
            </span>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-gray-300">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            <Film className="w-4 h-4 text-netflix-red" />
            Home
          </Link>
          <Link
            href="/reza-amanda-wedding"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Demo Undangan
          </Link>
          <Link
            href="/request"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4 text-netflix-red" />
            Request Undangan
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 text-gray-400"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Portal
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/request"
            className="bg-netflix-red hover:bg-netflix-redHover text-white px-4 py-2 rounded text-sm font-bold tracking-wide shadow-lg hover:shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Buat Undangan Sekarang
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-dark/95 backdrop-blur-lg border-b border-netflix-border px-4 pt-3 pb-6 space-y-3 mt-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-200 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/reza-amanda-wedding"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-200 hover:text-white"
          >
            Demo Undangan (Reza & Amanda)
          </Link>
          <Link
            href="/chapter-25-kevin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-200 hover:text-white"
          >
            Demo Birthday (Kevin Sanjaya)
          </Link>
          <Link
            href="/request"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-netflix-red font-bold"
          >
            Request Undangan Baru
          </Link>
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-400"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}

