"use client";

import React from "react";
import Image from "next/image";
import { PlayCircle, Clock } from "lucide-react";
import { StoryContent } from "@/types";

interface StoryBlockProps {
  content: StoryContent;
}

export function StoryBlock({ content }: StoryBlockProps) {
  const episodes = content.episodes || [];

  if (episodes.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-netflix-black border-t border-netflix-border/50 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-netflix-red" />
            <span className="text-xs font-bold uppercase tracking-widest text-netflix-red">
              Season 1 Episodes
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-serif">
            {content.heading || "OUR STORY: THE EPISODES"}
          </h2>
          {content.subheading && (
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
              {content.subheading}
            </p>
          )}
        </div>

        {/* Episode List */}
        <div className="space-y-6 sm:space-y-8">
          {episodes.map((ep, idx) => (
            <div
              key={idx}
              className="group relative bg-netflix-dark/60 hover:bg-netflix-dark border border-netflix-border/60 hover:border-netflix-red/40 rounded-xl p-4 sm:p-6 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Thumbnail */}
                <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 border border-neutral-800">
                  <Image
                    src={
                      ep.thumbnail ||
                      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white/80 group-hover:text-netflix-red group-hover:scale-110 transition-all drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded text-gray-200 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-netflix-red" />
                    {ep.duration || "2024"}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-netflix-red uppercase tracking-wider bg-netflix-red/10 border border-netflix-red/20 px-2 py-0.5 rounded">
                        {ep.episode || `Episode ${idx + 1}`}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-netflix-red transition-colors">
                        {ep.title}
                      </h3>
                    </div>
                    {ep.duration && (
                      <span className="text-xs text-gray-400 font-mono">
                        Year {ep.duration}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-2 font-light">
                    {ep.synopsis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

