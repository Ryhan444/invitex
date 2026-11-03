"use client";

import React from "react";
import Image from "next/image";
import { Play, Calendar, MapPin, Heart, Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { BannerContent } from "@/types";

interface BannerBlockProps {
  content: BannerContent;
  onOpenInvitation?: () => void;
  targetDate?: string;
}

export function BannerBlock({
  content,
  onOpenInvitation,
  targetDate,
}: BannerBlockProps) {
  const triggerOpen = () => {
    // Launch festive confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E50914", "#ffffff", "#ffd700", "#ff4b4b"],
      });
    } catch {
      // ignore
    }

    if (onOpenInvitation) {
      onOpenInvitation();
    }

    // Smooth scroll down to first content block
    const nextSection = document.getElementById("invitation-content");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const backdropUrl =
    content.backdrop_url ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80";

  return (
    <div className="relative min-h-[92vh] sm:min-h-screen flex items-end justify-start overflow-hidden bg-netflix-black text-white">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backdropUrl}
          alt={content.title || "Invitation Hero"}
          fill
          priority
          className="object-cover object-center transform scale-105 filter brightness-75 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Netflix Multi-stop Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/70 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-radial-netflix opacity-40 pointer-events-none" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24 pt-32">
        {/* Netflix Original Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-netflix-red text-white text-[11px] font-black tracking-widest px-2.5 py-0.5 rounded shadow-lg">
            N
          </span>
          <span className="text-xs sm:text-sm font-extrabold tracking-widest text-gray-200 uppercase">
            {content.badge || "AN INVITEFLIX ORIGINAL SPECIAL"}
          </span>
        </div>

        {/* Movie Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-serif leading-none drop-shadow-2xl mb-4">
          {content.title}
        </h1>

        {/* Subtitle / Tagline */}
        {content.subtitle && (
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-light mb-5 leading-relaxed drop-shadow">
            &ldquo;{content.subtitle}&rdquo;
          </p>
        )}

        {/* Couple / Host Spotlight details (if wedding) */}
        {(content.groom_name || content.bride_name) && (
          <div className="bg-black/50 backdrop-blur-md border border-netflix-border/80 rounded-xl p-4 sm:p-5 max-w-xl mb-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              {content.groom_name && (
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-netflix-red tracking-wider">
                    The Groom
                  </span>
                  <h4 className="text-base font-bold text-white">{content.groom_name}</h4>
                  {content.groom_parents && (
                    <p className="text-xs text-gray-400 mt-0.5">{content.groom_parents}</p>
                  )}
                </div>
              )}
              <div className="hidden sm:flex items-center justify-center text-netflix-red">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
              {content.bride_name && (
                <div className="flex-1 sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-netflix-red tracking-wider">
                    The Bride
                  </span>
                  <h4 className="text-base font-bold text-white">{content.bride_name}</h4>
                  {content.bride_parents && (
                    <p className="text-xs text-gray-400 mt-0.5">{content.bride_parents}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Netflix Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-gray-300 mb-7">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {content.rating || "99% Match"}
          </span>
          <span>•</span>
          <span>{content.year || "2026"}</span>
          <span>•</span>
          <span className="border border-gray-500 px-1.5 py-0.5 rounded text-[11px] font-bold text-gray-300">
            {content.season || "Season 1"}
          </span>
          <span>•</span>
          <span className="bg-neutral-800 text-gray-300 px-2 py-0.5 rounded text-[11px] font-bold">
            Ultra HD 4K
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={triggerOpen}
            className="flex items-center gap-2.5 bg-netflix-red hover:bg-netflix-redHover text-white px-7 py-3.5 rounded font-black text-sm sm:text-base tracking-wide shadow-2xl hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Play className="w-5 h-5 fill-current" />
            {content.cta_text || "Buka Undangan (Play)"}
          </button>

          <a
            href="#schedule"
            className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white px-6 py-3.5 rounded font-semibold text-sm sm:text-base backdrop-blur-md border border-neutral-700 hover:border-neutral-500 transition-all duration-200"
          >
            <Calendar className="w-4 h-4 text-netflix-red" />
            Jadwal Acara
          </a>
        </div>
      </div>
    </div>
  );
}

