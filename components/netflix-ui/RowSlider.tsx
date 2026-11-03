"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NetflixCard } from "./NetflixCard";
import { EventItem } from "@/types";

interface RowSliderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  events: EventItem[];
}

export function RowSlider({ title, subtitle, badge, events }: RowSliderProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="relative py-6 group/slider">
      {/* Category Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-netflix-red/20 text-netflix-red border border-netflix-red/30 px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight hover:text-netflix-red transition-colors cursor-pointer flex items-center gap-2">
            {title}
            <span className="text-xs text-netflix-red font-semibold opacity-0 group-hover/slider:opacity-100 transition-opacity">
              Explore All &rsaquo;
            </span>
          </h3>
        </div>
        {subtitle && (
          <span className="text-xs text-gray-400 hidden sm:inline-block">{subtitle}</span>
        )}
      </div>

      {/* Row with Navigation Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 text-white backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Scroll Container */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {events.map((event) => (
            <NetflixCard key={event.id} event={event} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200 text-white backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

