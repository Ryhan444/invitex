"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Sparkles,
  Send,
  Menu,
  X,
  Share2,
  Calendar,
  Heart,
  Camera,
  MessageSquare,
  Gift,
  Check,
} from "lucide-react";

interface NavbarProps {
  customTitle?: string;
  isInvitation?: boolean;
}

export function Navbar({ customTitle, isInvitation = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      })
      .catch(() => undefined);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-netflix-black/95 backdrop-blur-md shadow-2xl py-2.5 sm:py-3 border-b border-netflix-border/50"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Context Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-netflix-red uppercase font-serif drop-shadow-md group-hover:scale-105 transition-transform duration-200">
              INVITE<span className="text-white">FLIX</span>
            </span>
          </Link>

          {isInvitation ? (
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-neutral-700 min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-2 py-0.5 rounded flex-shrink-0">
                PREMIERE
              </span>
              {customTitle && (
                <span className="text-xs sm:text-sm font-semibold text-gray-200 truncate hidden xs:inline-block max-w-[140px] sm:max-w-xs md:max-w-sm">
                  {customTitle}
                </span>
              )}
            </div>
          ) : (
            customTitle && (
              <span className="hidden md:inline-block ml-3 px-2.5 py-0.5 rounded text-xs font-semibold bg-netflix-dark text-netflix-lightGray border border-netflix-border">
                {customTitle}
              </span>
            )
          )}
        </div>

        {/* Invitation navbar: on-page sections only */}
        {isInvitation ? (
          <>
            {/* Desktop Navigation for Invitation Viewers */}
            <div className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium text-gray-300">
              <button
                onClick={() => scrollToSection("invitation-hero")}
                className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <Film className="w-4 h-4 text-netflix-red" />
                Cover
              </button>
              <button
                onClick={() => scrollToSection("schedule")}
                className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4 text-netflix-red" />
                Schedule & Venue
              </button>
              <button
                onClick={() => scrollToSection("guestbook")}
                className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-netflix-red" />
                Send Wishes
              </button>
            </div>

            {/* Desktop Quick Share Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={handleCopyLink}
                className="bg-neutral-800/90 hover:bg-neutral-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide border border-neutral-700 transition-all flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-netflix-red" />
                    <span>Share Invitation</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Menu Button for Invitation */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-gray-200 hover:text-white"
                title="Copy link"
                aria-label="Copy invitation link"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4 text-netflix-red" />
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg bg-neutral-900/90 border border-neutral-800"
                aria-label="Toggle section menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-netflix-red" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </>
        ) : (
          /* Public navbar (home / request) */
          <>
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
                Demo
              </Link>
              <Link
                href="/request"
                className="hover:text-white transition-colors duration-200 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4 text-netflix-red" />
                Request
              </Link>
            </div>

            {/* Desktop Action Button */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/request"
                className="bg-netflix-red hover:bg-netflix-redHover text-white px-4 py-2 rounded-lg text-sm font-bold tracking-wide shadow-lg hover:shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Create Your Invitation
              </Link>
            </div>

            {/* Mobile menu button for Public Pages */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg bg-neutral-900/90 border border-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-netflix-red" /> : <Menu className="w-5 h-5" />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-netflix-dark/95 backdrop-blur-xl border-b border-netflix-border px-4 pt-3 pb-6 space-y-2.5 mt-2 ">
          {isInvitation ? (
            /* Invitation mobile navigation: on-page sections only */
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-netflix-red px-2 py-1">
                Sections
              </div>
              <button
                onClick={() => scrollToSection("invitation-hero")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <Film className="w-4 h-4 text-netflix-red" />
                <span>Cover</span>
              </button>
              <button
                onClick={() => scrollToSection("story")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <Heart className="w-4 h-4 text-netflix-red" />
                <span>Our Story</span>
              </button>
              <button
                onClick={() => scrollToSection("schedule")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <Calendar className="w-4 h-4 text-netflix-red" />
                <span>Schedule & Venue</span>
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <Camera className="w-4 h-4 text-netflix-red" />
                <span>Gallery</span>
              </button>
              <button
                onClick={() => scrollToSection("donation")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <Gift className="w-4 h-4 text-netflix-red" />
                <span>Digital Gifts</span>
              </button>
              <button
                onClick={() => scrollToSection("guestbook")}
                className="w-full text-left flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                <MessageSquare className="w-4 h-4 text-netflix-red" />
                <span>RSVP & Wishes</span>
              </button>
              <div className="pt-2 border-t border-neutral-800">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-netflix-red" />
                      <span>Copy Invitation Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Public Mobile Navigation (Home / Request) */
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                Home
              </Link>
              <Link
                href="/reza-amanda-wedding"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                Wedding Demo (Reza & Amanda)
              </Link>
              <Link
                href="/chapter-25-kevin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-200 hover:text-white hover:bg-neutral-800"
              >
                Demo Birthday (Kevin Sanjaya)
              </Link>
              <Link
                href="/request"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-netflix-red bg-netflix-red/10 border border-netflix-red/20"
              >
                Request an Invitation
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
