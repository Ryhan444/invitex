"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Info, Calendar, Sparkles } from "lucide-react";
import { EventItem } from "@/types";

interface NetflixCardProps {
  event: EventItem;
  featured?: boolean;
}

export function NetflixCard({ event, featured = false }: NetflixCardProps) {
  const bannerSection = event.sections?.find((s) => s.type === "banner");
  const posterUrl =
    bannerSection?.content?.poster_url ||
    bannerSection?.content?.backdrop_url ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80";

  const tags = bannerSection?.content?.tags || [
    event.event_type.toUpperCase(),
    "Cinematic",
    "Exclusive",
  ];

  const matchRate = event.theme_config?.match_rate || "99% Match";
  const maturityRating = event.theme_config?.maturity_rating || "ALL AGES";
  const seasonBadge = event.theme_config?.season_badge || "Special Edition";

  return (
    <div className="group relative flex-none w-[230px] xs:w-[260px] sm:w-[300px] transition-all duration-300 hover:z-30">
      <Link href={`/${event.slug}`} className="block">
        {/* Card Poster Container */}
        <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden bg-netflix-dark border border-netflix-border/50 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-netflix-red/60 transition-all duration-300">
          <Image
            src={posterUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 260px, 300px"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent opacity-80" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="bg-netflix-red text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider shadow">
              ORIGINAL
            </span>
            <span className="bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
              {seasonBadge}
            </span>
          </div>

          {/* Quick Info Overlay at bottom of card */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold tracking-tight text-[11px]">
              {matchRate}
            </span>
            <span className="text-gray-300 text-[10px] border border-gray-600 px-1 py-0.2 rounded">
              {maturityRating}
            </span>
          </div>
        </div>

        {/* Card Metadata info (appears below or on hover) */}
        <div className="pt-2 px-1">
          <h4 className="text-sm font-bold text-white group-hover:text-netflix-red transition-colors line-clamp-1">
            {event.title}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3 h-3 text-netflix-red" />
              {new Date(event.event_date).toLocaleDateString("id-ID", {
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="capitalize">{event.event_type}</span>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.slice(0, 2).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[10px] text-gray-400 bg-netflix-dark/80 px-1.5 py-0.5 rounded border border-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

