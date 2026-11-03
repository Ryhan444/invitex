"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/netflix-ui/Navbar";
import {
  Send,
  Film,
  CheckCircle2,
} from "lucide-react";
import { SectionType } from "@/types";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export default function RequestPortalPage() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [eventTitle, setEventTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [preferredSlug, setPreferredSlug] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedBlocks, setSelectedBlocks] = useState<SectionType[]>([
    "banner",
    "story",
    "schedule",
    "maps",
    "gallery",
    "donation",
    "guestbook",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const blockOptions: { id: SectionType; title: string; desc: string }[] = [
    {
      id: "banner",
      title: "Cinematic Hero Billboard",
      desc: "Main banner with your title, backdrop image and a play button to open the invitation.",
    },
    {
      id: "story",
      title: "Story / Episodes Block",
      desc: "Your story told as a series of film episodes.",
    },
    {
      id: "schedule",
      title: "Schedule & Countdown Timer",
      desc: "Ceremony and reception times, a live countdown and Add to Google Calendar.",
    },
    {
      id: "maps",
      title: "Interactive Maps & Venue",
      desc: "Exact venue location with Google Maps directions.",
    },
    {
      id: "gallery",
      title: "Gallery & Trailers",
      desc: "Cinematic photo and video gallery with a fullscreen viewer.",
    },
    {
      id: "donation",
      title: "Digital Gifts & QRIS",
      desc: "Bank accounts, e-wallets and a scannable QRIS code.",
    },
    {
      id: "guestbook",
      title: "Live Guestbook & Realtime RSVP",
      desc: "Live wishes feed and real-time attendance confirmation.",
    },
  ];

  const toggleBlock = (id: SectionType) => {
    if (selectedBlocks.includes(id)) {
      if (selectedBlocks.length === 1) return; // Keep at least one
      setSelectedBlocks(selectedBlocks.filter((b) => b !== id));
    } else {
      setSelectedBlocks([...selectedBlocks, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          event_type: eventType,
          payload_data: {
            event_title: eventTitle || `${clientName}'s Premiere`,
            target_date: targetDate,
            preferred_slug: toSlug(preferredSlug),
            notes,
            backdrop_url: backdropUrl,
            selected_blocks: selectedBlocks,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error || "We couldn't submit your request. Please try again.");
        return;
      }

      setSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrorMsg("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24 w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-netflix-red/10 border border-netflix-red/30 px-3.5 py-1 rounded-full mb-3">
            <Film className="w-4 h-4 text-netflix-red" />
            <span className="text-xs font-bold text-netflix-red uppercase tracking-widest">
              Invitation Request
            </span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            Request your cinematic invitation
          </h1>
          <p className="text-xs sm:text-base text-gray-400 mt-2 sm:mt-3 max-w-xl mx-auto">
            Fill in the form below. Our team will prepare the storyboard and launch your exclusive digital invitation.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="bg-netflix-dark border border-netflix-border/80 rounded-2xl p-6 sm:p-12 text-center shadow-2xl max-w-xl mx-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase font-serif mb-3">
              Request submitted!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Thank you, <strong className="text-white">{clientName}</strong>. We&apos;ve received your request for &ldquo;<strong className="text-white">{eventTitle || "your event"}</strong>&rdquo; and it is now <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">PENDING</span> review.
              Our team will contact you on WhatsApp at <strong className="text-white">{clientPhone}</strong> shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/reza-amanda-wedding"
                className="bg-netflix-red hover:bg-netflix-redHover text-white px-6 py-3 rounded-xl font-bold text-sm text-center"
              >
                View a Sample Invitation
              </Link>
              <Link
                href="/"
                className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-6 py-3 rounded-xl font-medium text-sm border border-neutral-700 text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-4 sm:p-10 shadow-2xl space-y-6 sm:space-y-8"
          >
            {errorMsg && (
              <div role="alert" className="p-3.5 sm:p-4 bg-red-950/80 border border-netflix-red text-red-200 text-xs sm:text-sm rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Section 1: Contact */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-netflix-border pb-2">
                <span className="w-6 h-6 rounded-full bg-netflix-red text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                Your Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="e.g. Reza Rahardian"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    maxLength={20}
                    pattern="\+?[0-9\s\-]{8,20}"
                    autoComplete="tel"
                    placeholder="081234567890"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Details */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-netflix-border pb-2">
                <span className="w-6 h-6 rounded-full bg-netflix-red text-white flex items-center justify-center text-xs font-black">
                  2
                </span>
                Event Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="graduation">Graduation</option>
                    <option value="seminar">Seminar / Conference</option>
                    <option value="party">Party / Gala Night</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Event Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    maxLength={150}
                    placeholder="e.g. Reza & Amanda: The Beginning of Forever"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Custom Link (optional)
                  </label>
                  <div className="flex items-center bg-neutral-900 border border-netflix-border rounded-xl px-3">
                    <span className="text-xs text-gray-500 font-mono">inviteflix.com/</span>
                    <input
                      type="text"
                      value={preferredSlug}
                      onChange={(e) => setPreferredSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      maxLength={80}
                      placeholder="reza-amanda"
                      className="w-full bg-transparent py-2.5 text-base sm:text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Cover Photo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={backdropUrl}
                    onChange={(e) => setBackdropUrl(e.target.value)}
                    maxLength={2048}
                    placeholder="https://…"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Sections */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-netflix-border pb-2">
                <span className="w-6 h-6 rounded-full bg-netflix-red text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                Choose Your Sections
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Select the sections you want to include in your invitation:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blockOptions.map((opt) => {
                  const isChecked = selectedBlocks.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleBlock(opt.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                        isChecked
                          ? "bg-netflix-red/10 border-netflix-red text-white"
                          : "bg-neutral-900/60 border-neutral-800 text-gray-400 hover:border-neutral-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded text-netflix-red focus:ring-netflix-red h-4 w-4 accent-netflix-red"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Notes for Our Team
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
                placeholder="Share a short version of your story, a song request, or any special instructions…"
                className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red resize-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-black py-4 rounded-xl text-base tracking-wide shadow-2xl shadow-red-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isSubmitting
                  ? "Submitting…"
                  : "Submit Request"}
              </button>
              <p className="text-[11px] text-gray-500 text-center mt-3">
                Submitting this form sends your request to the Inviteflix team. No upfront payment is required.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

