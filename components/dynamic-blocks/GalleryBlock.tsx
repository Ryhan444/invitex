"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { GalleryContent, GalleryPhoto } from "@/types";

interface GalleryBlockProps {
  content: GalleryContent;
}

export function GalleryBlock({ content }: GalleryBlockProps) {
  const photos = content.photos || [];
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-netflix-black border-t border-netflix-border/50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-netflix-red" />
            <span className="text-xs font-bold uppercase tracking-widest text-netflix-red">
              Visual Highlights
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            {content.heading || "BEHIND THE SCENES & TRAILERS"}
          </h2>
          {content.subheading && (
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
              {content.subheading}
            </p>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {photos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-netflix-dark cursor-pointer border border-netflix-border/60 hover:border-netflix-red transition-all duration-300 shadow-lg"
            >
              <Image
                src={photo.url}
                alt={photo.title || `Photo ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                {photo.tag && (
                  <span className="text-[10px] uppercase font-bold text-netflix-red tracking-wider">
                    {photo.tag}
                  </span>
                )}
                {photo.title && (
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {photo.title}
                  </h4>
                )}
                <div className="flex items-center justify-end mt-1">
                  <Maximize2 className="w-4 h-4 text-white/80" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full bg-neutral-900 border border-neutral-700 z-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 text-white p-3 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 z-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 text-white p-3 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 z-50"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full h-[70vh] rounded-lg overflow-hidden">
              <Image
                src={photos[activePhotoIndex].url}
                alt={photos[activePhotoIndex].title || "Gallery photo"}
                fill
                className="object-contain"
                priority
              />
            </div>
            {photos[activePhotoIndex].title && (
              <p className="mt-3 text-sm text-gray-300 font-medium">
                {photos[activePhotoIndex].title} ({activePhotoIndex + 1} / {photos.length})
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

