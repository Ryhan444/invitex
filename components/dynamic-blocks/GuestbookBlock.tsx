"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle2, User, Clock, Heart, Users } from "lucide-react";
import { GuestWish, GuestbookContent, AttendanceStatus } from "@/types";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface GuestbookBlockProps {
  content: GuestbookContent;
  eventId: string;
  initialWishes?: GuestWish[];
}

export function GuestbookBlock({
  content,
  eventId,
  initialWishes = [],
}: GuestbookBlockProps) {
  const [wishes, setWishes] = useState<GuestWish[]>(initialWishes);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus>("attending");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  // Sync with initialWishes when provided
  useEffect(() => {
    if (initialWishes && initialWishes.length > 0) {
      setWishes(initialWishes);
    }
  }, [initialWishes]);

  // Setup Supabase Realtime Channel
  useEffect(() => {
    if (!isSupabaseConfigured() || !eventId) return;

    try {
      const supabase = createSupabaseBrowserClient();
      const channel = supabase
        .channel(`guest_wishes:${eventId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "guest_wishes",
            filter: `event_id=eq.${eventId}`,
          },
          (payload) => {
            const newWish = payload.new as GuestWish;
            setWishes((prev) => {
              if (prev.some((w) => w.id === newWish.id)) return prev;
              return [newWish, ...prev];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error("Realtime subscription error:", err);
    }
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const tempWish: GuestWish = {
      id: `w-${Date.now()}`,
      event_id: eventId,
      name: name.trim(),
      attendance_status: attendance,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update immediately
    setWishes((prev) => [tempWish, ...prev]);
    setName("");
    setMessage("");
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 4000);

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          name: tempWish.name,
          attendance_status: tempWish.attendance_status,
          message: tempWish.message,
        }),
      });

      if (!res.ok) {
        console.warn("Failed to persist wish to API, kept locally in UI");
      }
    } catch (err) {
      console.error("Error submitting wish:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "attending":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ✓ Hadir
          </span>
        );
      case "not_attending":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            ✕ Berhalangan
          </span>
        );
      case "tentative":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ? Ragu-ragu
          </span>
        );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-netflix-black border-t border-netflix-border/50 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-netflix-red/10 border border-netflix-red/30 px-3 py-1 rounded-full mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-netflix-red" />
            <span className="text-xs font-bold text-netflix-red uppercase tracking-widest">
              Live Realtime Guestbook
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            {content.heading || "AUDIENCE REVIEWS & WISHES"}
          </h2>
          {content.subheading && (
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl mx-auto">
              {content.subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form (5 columns) */}
          <div className="lg:col-span-5 bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-netflix-red fill-current" />
              Kirim Ucapan & RSVP
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Ulasan Anda akan langsung tampil secara realtime tanpa reload halaman.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso & Partner"
                  className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red transition-colors placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "attending", label: "Hadir" },
                    { id: "tentative", label: "Ragu" },
                    { id: "not_attending", label: "Tidak" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAttendance(opt.id as AttendanceStatus)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center ${
                        attendance === opt.id
                          ? "bg-netflix-red text-white border-netflix-red shadow"
                          : "bg-neutral-900 text-gray-400 border-netflix-border hover:border-neutral-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Pesan & Doa Restu *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan ulasan film cinta dan doa terbaik Anda di sini..."
                  className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red transition-colors placeholder:text-neutral-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-bold py-3 rounded-lg text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Mengirim Ucapan..." : "Kirim Ulasan & RSVP"}
              </button>

              {successNotice && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Terima kasih! Ucapan Anda telah ditayangkan secara live.</span>
                </div>
              )}
            </form>
          </div>

          {/* Live Wish Stream (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-netflix-border">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                <Users className="w-4 h-4 text-netflix-red" />
                <span>Live Audience Feed ({wishes.length})</span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Realtime Connected
              </span>
            </div>

            {wishes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-800">
                Belum ada ucapan. Jadilah yang pertama memberikan ulasan!
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-4 shadow-md hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-netflix-red/30 border border-netflix-red/40 flex items-center justify-center text-xs font-black text-netflix-red">
                          {w.name.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="text-sm font-bold text-white">{w.name}</h4>
                      </div>
                      {getAttendanceBadge(w.attendance_status)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-9">
                      {w.message}
                    </p>
                    <div className="text-[10px] text-gray-400 pl-9 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(w.created_at).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

