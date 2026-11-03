"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useAdminHref } from "@/components/admin/AdminPathContext";

const SESSION_EXPIRED_MSG = "Your session has expired. Please sign in again.";
const GENERIC_ERROR_MSG = "Something went wrong while creating the event. Please try again.";

// Slugs: lowercase letters, numbers and hyphens only, 3-80 chars (enforced by the API)
const sanitizeSlug = (val: string) =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, 80);

export default function CreateEventPage() {
  const router = useRouter();
  const adminHref = useAdminHref();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [eventDate, setEventDate] = useState("2026-12-25T10:00");
  const [audioUrl, setAudioUrl] = useState(
    "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3"
  );
  const [audioTitle, setAudioTitle] = useState("Cinematic Love Soundtrack");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSlugify = (val: string) => {
    setTitle(val);
    setSlug(sanitizeSlug(val.trim()).replace(/-+$/, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const finalSlug = slug.replace(/-+$/, "");
    if (finalSlug.length < 3) {
      setErrorMsg("The slug must be 3-80 characters: lowercase letters, numbers and hyphens only.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: finalSlug,
          event_type: eventType,
          event_date: eventDate,
          theme_config: {
            primary_color: "#E50914",
            bg_color: "#141414",
            font_family: "Bebas Neue",
            audio_url: audioUrl,
            audio_title: audioTitle,
            match_rate: "99% Match",
            maturity_rating: "ALL AGES",
            season_badge: "Season 1",
          },
          is_published: isPublished,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(res.status === 404 ? SESSION_EXPIRED_MSG : data?.error || GENERIC_ERROR_MSG);
        return;
      }

      router.push(adminHref("/dashboard"));
    } catch (err) {
      console.error("Create event error:", err);
      setErrorMsg(GENERIC_ERROR_MSG);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={adminHref("/dashboard")}
          aria-label="Back to dashboard"
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-serif truncate">
            CREATE NEW INVITATION (MANUAL CREATOR)
          </h1>
          <p className="text-xs text-gray-400 truncate">
            Register a new event title in the Inviteflix database.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-4 sm:p-8 shadow-2xl space-y-5"
      >
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-netflix-red text-red-200 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Event / Movie Title *
          </label>
          <input
            type="text"
            required
            maxLength={150}
            value={title}
            onChange={(e) => handleSlugify(e.target.value)}
            placeholder="e.g. Sarah & Michael Wedding Premiere"
            className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Custom URL Slug *
          </label>
          <div className="flex items-center bg-neutral-900 border border-netflix-border rounded-xl px-3">
            <span className="text-xs text-gray-500 font-mono">inviteflix.com/</span>
            <input
              type="text"
              required
              minLength={3}
              maxLength={80}
              pattern="[a-z0-9-]{3,80}"
              title="3-80 characters: lowercase letters, numbers and hyphens only"
              value={slug}
              onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
              placeholder="sarah-michael-wedding"
              className="w-full bg-transparent py-2.5 text-base sm:text-sm text-white focus:outline-none font-mono placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Event Category
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
            >
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="graduation">Graduation</option>
              <option value="seminar">Seminar / Summit</option>
              <option value="party">VIP Party</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Background Music URL (MP3)
          </label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Soundtrack Title
          </label>
          <input
            type="text"
            value={audioTitle}
            onChange={(e) => setAudioTitle(e.target.value)}
            className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded text-netflix-red focus:ring-netflix-red accent-netflix-red"
          />
          <label htmlFor="published" className="text-xs font-semibold text-gray-200">
            Publish immediately (guests can access the /[slug] page)
          </label>
        </div>

        <div className="pt-4 border-t border-netflix-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-bold py-3.5 rounded-xl text-sm shadow-xl shadow-red-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? "Saving Event..." : "Save & Continue to Edit Blocks"}
          </button>
        </div>
      </form>
    </div>
  );
}

