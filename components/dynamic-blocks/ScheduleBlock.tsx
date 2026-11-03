"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Sparkles } from "lucide-react";
import { ScheduleContent, ScheduleEvent } from "@/types";

interface ScheduleBlockProps {
  content: ScheduleContent;
  eventDate?: string;
}

export function ScheduleBlock({ content, eventDate }: ScheduleBlockProps) {
  const events = content.events || [];

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = eventDate ? new Date(eventDate).getTime() : new Date("2026-12-25T10:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  const addToCalendar = (eventItem: ScheduleEvent) => {
    const title = encodeURIComponent(eventItem.title);
    const location = encodeURIComponent(eventItem.address || eventItem.location_name);
    const details = encodeURIComponent(eventItem.notes || "Inviteflix Digital Invitation");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}`;
    window.open(calendarUrl, "_blank");
  };

  return (
    <section id="schedule" className="scroll-mt-16 py-14 sm:py-24 bg-netflix-carbon border-t border-netflix-border/50 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-netflix-red/10 border border-netflix-red/30 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-netflix-red" />
            <span className="text-xs font-bold text-netflix-red uppercase tracking-widest">
              Save The Date
            </span>
          </div>
          <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            {content.heading || "PREMIERE SCHEDULE & VENUE"}
          </h2>
          {content.subheading && (
            <p className="text-xs sm:text-base text-gray-400 mt-2">
              {content.subheading}
            </p>
          )}

          {/* Countdown Timer Display (Netflix Digits) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mt-6 sm:mt-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-netflix-dark/80 border border-netflix-border/80 rounded-xl p-2.5 sm:p-4 text-center shadow-lg"
              >
                <div className="text-xl sm:text-4xl font-black text-netflix-red font-mono">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold mt-0.5 sm:mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-6 sm:p-8 hover:border-netflix-red/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-widest bg-netflix-red text-white px-2.5 py-1 rounded">
                    Event #{idx + 1}
                  </span>
                  <button
                    onClick={() => addToCalendar(ev)}
                    className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-netflix-red" />
                    + Google Calendar
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  {ev.title}
                </h3>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-netflix-red flex-shrink-0" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-netflix-red flex-shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-netflix-red flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">{ev.location_name}</span>
                      <span className="text-gray-400 text-xs">{ev.address}</span>
                    </div>
                  </div>
                </div>

                {ev.notes && (
                  <div className="mt-4 p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-gray-400 italic">
                    {ev.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Embedded Map Section */}
        {content.maps_embed_url && (
          <div className="rounded-xl overflow-hidden border border-netflix-border/80 shadow-2xl bg-neutral-900">
            <div className="p-4 bg-netflix-dark flex flex-wrap items-center justify-between gap-3 border-b border-netflix-border/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <MapPin className="w-4 h-4 text-netflix-red" />
                <span>Interactive Venue Navigation</span>
              </div>
              {content.google_maps_url && (
                <a
                  href={content.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-netflix-red hover:underline flex items-center gap-1 font-semibold"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="relative w-full h-[320px] sm:h-[400px]">
              <iframe
                src={content.maps_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

