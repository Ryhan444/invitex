"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/netflix-ui/Navbar";
import {
  Send,
  Sparkles,
  Calendar,
  Film,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  ImageIcon,
} from "lucide-react";
import { SectionType } from "@/types";

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
      desc: "Banner utama, judul film, backdrop, dan tombol play buka undangan.",
    },
    {
      id: "story",
      title: "Story / Episodes Block",
      desc: "Rundown cerita pertemuan dalam bentuk episode film.",
    },
    {
      id: "schedule",
      title: "Schedule & Countdown Timer",
      desc: "Waktu akad/resepsi/pesta, countdown realtime, dan add to Google Calendar.",
    },
    {
      id: "maps",
      title: "Interactive Maps & Venue",
      desc: "Lokasi akurat dan navigasi Google Maps langsung di undangan.",
    },
    {
      id: "gallery",
      title: "Gallery & Trailers",
      desc: "Galeri foto & video cinematic dengan viewer fullscreen.",
    },
    {
      id: "donation",
      title: "Digital Gift & QRIS Box Office",
      desc: "Nomor rekening bank, dompet digital, dan scan barcode QRIS.",
    },
    {
      id: "guestbook",
      title: "Live Guestbook & Realtime RSVP",
      desc: "Form ucapan live stream dan konfirmasi kehadiran realtime.",
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
            preferred_slug: preferredSlug
              ? preferredSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-")
              : "",
            notes,
            backdrop_url: backdropUrl,
            selected_blocks: selectedBlocks,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim permohonan");
      }

      setSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses permohonan.");
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
              Portal Pembuatan Undangan
            </span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif">
            REQUEST YOUR CINEMATIC INVITATION
          </h1>
          <p className="text-xs sm:text-base text-gray-400 mt-2 sm:mt-3 max-w-xl mx-auto">
            Isi formulir di bawah ini. Tim kami akan menyiapkan storyboard dan merilis premiere undangan digital eksklusif Anda.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="bg-netflix-dark border border-netflix-border/80 rounded-2xl p-6 sm:p-12 text-center shadow-2xl max-w-xl mx-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white uppercase font-serif mb-3">
              PERMOHONAN BERHASIL DIKIRIM!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Terima kasih, <strong className="text-white">{clientName}</strong>. Pengajuan undangan dengan judul &ldquo;<strong className="text-white">{eventTitle || "Acara Anda"}</strong>&rdquo; telah kami terima dengan status <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">PENDING</span>.
              Tim admin Inviteflix akan segera menghubungi via WhatsApp di <strong className="text-white">{clientPhone}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/reza-amanda-wedding"
                className="bg-netflix-red hover:bg-netflix-redHover text-white px-6 py-3 rounded-xl font-bold text-sm text-center"
              >
                Lihat Contoh Undangan
              </Link>
              <Link
                href="/"
                className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-6 py-3 rounded-xl font-medium text-sm border border-neutral-700 text-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-4 sm:p-10 shadow-2xl space-y-6 sm:space-y-8"
          >
            {errorMsg && (
              <div className="p-3.5 sm:p-4 bg-red-950/80 border border-netflix-red text-red-200 text-xs sm:text-sm rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Section 1: Client Information */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-netflix-border pb-2">
                <span className="w-6 h-6 rounded-full bg-netflix-red text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                Informasi Kontak Pemesan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nama Lengkap / Kontak *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Reza Rahardian"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Email Aktif *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
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
                Detail Acara & Judul Film
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Tipe Acara *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  >
                    <option value="wedding">Pernikahan (Wedding Premiere)</option>
                    <option value="birthday">Ulang Tahun (Birthday Bash)</option>
                    <option value="graduation">Wisuda / Kelulusan</option>
                    <option value="seminar">Seminar / Konferensi</option>
                    <option value="party">VIP Party / Gala Night</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Tanggal Penayangan Acara *
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
                    Judul Acara / Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Contoh: Reza & Amanda: The Beginning of Forever"
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Request URL Slug Khusus (Opsional)
                  </label>
                  <div className="flex items-center bg-neutral-900 border border-netflix-border rounded-xl px-3">
                    <span className="text-xs text-gray-500 font-mono">inviteflix.com/</span>
                    <input
                      type="text"
                      value={preferredSlug}
                      onChange={(e) => setPreferredSlug(e.target.value)}
                      placeholder="reza-amanda"
                      className="w-full bg-transparent py-2.5 text-base sm:text-sm text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    URL Foto Cover / Backdrop (Opsional)
                  </label>
                  <input
                    type="url"
                    value={backdropUrl}
                    onChange={(e) => setBackdropUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-900 border border-netflix-border rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-netflix-red"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Dynamic Blocks Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2 border-b border-netflix-border pb-2">
                <span className="w-6 h-6 rounded-full bg-netflix-red text-white flex items-center justify-center text-xs font-black">
                  3
                </span>
                Pilih Blok Komponen Undangan
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Centang blok yang ingin Anda sertakan di dalam undangan film Anda:
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
                Catatan Khusus / Ringkasan Cerita untuk Tim Produksi
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ceritakan gambaran singkat kisah cinta, request lagu latar, atau petunjuk khusus untuk admin..."
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
                  ? "Mengirimkan Pengajuan..."
                  : "Kirim Permohonan Undangan Sekarang"}
              </button>
              <p className="text-[11px] text-gray-500 text-center mt-3">
                Dengan menekan tombol di atas, Anda mengajukan permohonan ke tim kurasi Inviteflix. Tidak ada pembayaran langsung di muka.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

