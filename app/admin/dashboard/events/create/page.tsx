"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Film, ArrowLeft, Sparkles, Check } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
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
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/ +/g, "-")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat event");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat acara.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-serif">
            BUAT UNDANGAN BARU (MANUAL CREATOR)
          </h1>
          <p className="text-xs text-gray-400">
            Daftarkan judul acara baru ke database Inviteflix.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-netflix-dark/90 border border-netflix-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
      >
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-netflix-red text-red-200 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Judul Acara / Movie Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleSlugify(e.target.value)}
            placeholder="Contoh: Sarah & Michael Wedding Premiere"
            className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Slug URL Eksklusif *
          </label>
          <div className="flex items-center bg-neutral-900 border border-netflix-border rounded-lg px-3">
            <span className="text-xs text-gray-500 font-mono">inviteflix.com/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-transparent py-2.5 text-sm text-white focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Kategori Acara
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
            >
              <option value="wedding">Wedding (Pernikahan)</option>
              <option value="birthday">Birthday (Ulang Tahun)</option>
              <option value="graduation">Graduation (Wisuda)</option>
              <option value="seminar">Seminar / Summit</option>
              <option value="party">VIP Party</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tanggal Penayangan Acara
            </label>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            URL Musik Latar (MP3)
          </label>
          <input
            type="url"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Judul Soundtrack Musik
          </label>
          <input
            type="text"
            value={audioTitle}
            onChange={(e) => setAudioTitle(e.target.value)}
            className="w-full bg-neutral-900 border border-netflix-border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-netflix-red"
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
            Publikasikan langsung (Tamu dapat mengakses halaman /[slug])
          </label>
        </div>

        <div className="pt-4 border-t border-netflix-border">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-bold py-3.5 rounded-xl text-sm shadow-xl shadow-red-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? "Menyimpan Acara..." : "Simpan & Lanjutkan ke Edit Blok"}
          </button>
        </div>
      </form>
    </div>
  );
}

