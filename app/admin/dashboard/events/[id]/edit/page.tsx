"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  ExternalLink,
  Code2,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { EventItem, EventSection, SectionType } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventSectionsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [sections, setSections] = useState<EventSection[]>([]);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        if (data.data) {
          setEvent(data.data);
          const secs = (data.data.sections || []).sort(
            (a: EventSection, b: EventSection) => a.order_index - b.order_index
          );
          setSections(secs);
        }
      } catch (err) {
        console.error("Failed to load event:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Re-index
    const reindexed = newSections.map((sec, idx) => ({
      ...sec,
      order_index: idx,
    }));
    setSections(reindexed);
  };

  const toggleVisibility = (index: number) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      is_visible: !newSections[index].is_visible,
    };
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    if (confirm("Hapus blok komponen ini dari penayangan?")) {
      const newSections = sections
        .filter((_, idx) => idx !== index)
        .map((sec, idx) => ({ ...sec, order_index: idx }));
      setSections(newSections);
      if (activeEditingId === sections[index]?.id) {
        setActiveEditingId(null);
      }
    }
  };

  const addBlock = (type: SectionType) => {
    const defaultContents: Record<SectionType, any> = {
      banner: {
        badge: "INVITEFLIX ORIGINAL SPECIAL",
        title: event?.title || "Judul Undangan",
        subtitle: "Sinopsis romansa perjalanan cinta kami.",
        backdrop_url:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
        cta_text: "Buka Undangan (Play)",
      },
      story: {
        heading: "OUR STORY: THE EPISODES",
        subheading: "Kisah pertemuan kami yang tak terlupakan.",
        episodes: [
          {
            episode: "Episode 1",
            title: "Pertemuan Pertama",
            duration: "2022",
            synopsis: "Pertama kali berjumpa dan bertukar sapa di kafe favorit.",
          },
        ],
      },
      schedule: {
        heading: "PREMIERE SCHEDULE & VENUE",
        events: [
          {
            title: "Akad Nikah",
            date: "Minggu, 12 Desember 2026",
            time: "09:00 WIB",
            location_name: "Grand Ballroom Hotel",
            address: "Jl. Sudirman No. 1, Jakarta",
          },
        ],
      },
      maps: {
        heading: "PETA LOKASI",
        google_maps_url: "https://maps.google.com",
      },
      gallery: {
        heading: "GALLERY TRAILERS",
        photos: [
          {
            title: "Foto 1",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
      donation: {
        heading: "BOX OFFICE CONTRIBUTION",
        accounts: [
          {
            bank_name: "BCA",
            account_number: "1234567890",
            account_holder: "Nama Penerima",
          },
        ],
      },
      guestbook: {
        heading: "AUDIENCE REVIEWS & WISHES",
        rsvp_enabled: true,
      },
    };

    const newSec: EventSection = {
      id: `sec-${Date.now()}`,
      event_id: eventId,
      type,
      order_index: sections.length,
      is_visible: true,
      content: defaultContents[type] || {},
    };

    setSections([...sections, newSec]);
  };

  const openJsonEditor = (sec: EventSection) => {
    setActiveEditingId(sec.id);
    setJsonText(JSON.stringify(sec.content, null, 2));
    setJsonError("");
  };

  const saveJsonEditor = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setSections((prev) =>
        prev.map((s) => (s.id === activeEditingId ? { ...s, content: parsed } : s))
      );
      setActiveEditingId(null);
      setJsonError("");
    } catch (e: any) {
      setJsonError("Format JSON tidak valid: " + e.message);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving sections:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Memuat data editor...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-red-400">Event tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-netflix-border/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-netflix-red text-white px-2 py-0.5 rounded flex-shrink-0">
                BLOCK EDITOR
              </span>
              <h1 className="text-lg sm:text-2xl font-black text-white uppercase font-serif truncate">
                {event.title}
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              Tautan slug publik:{" "}
              <span className="font-mono text-gray-300">/{event.slug}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/${event.slug}`}
            target="_blank"
            className="flex-1 sm:flex-none justify-center bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-netflix-red" />
            <span>Live Preview</span>
          </Link>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none justify-center bg-netflix-red hover:bg-netflix-redHover text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl shadow-red-900/40 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Semua Blok"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Berhasil! Urutan dan konten blok undangan telah tersimpan.</span>
        </div>
      )}

      {/* Editor Layout (Two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Blocks List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-netflix-red" />
              Urutan Blok Penayangan ({sections.length})
            </h2>
            <span className="text-[11px] text-gray-400">
              Gunakan panah untuk re-order urutan blok
            </span>
          </div>

          {sections.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className={`border rounded-xl p-4 transition-all ${
                activeEditingId === sec.id
                  ? "bg-neutral-900 border-netflix-red shadow-lg"
                  : sec.is_visible
                  ? "bg-netflix-dark/80 border-netflix-border/80 hover:border-neutral-600"
                  : "bg-neutral-950/60 border-neutral-800 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-neutral-900 text-gray-300 flex items-center justify-center text-xs font-mono font-bold border border-neutral-800 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        {sec.type}
                      </span>
                      {!sec.is_visible && (
                        <span className="text-[10px] text-gray-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {sec.content.heading ||
                        sec.content.title ||
                        `Blok ${sec.type} default`}
                    </p>
                  </div>
                </div>

                {/* Block Controls */}
                <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto pt-1 sm:pt-0">
                  <button
                    onClick={() => moveSection(idx, "up")}
                    disabled={idx === 0}
                    className="p-2 sm:p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Geser ke Atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveSection(idx, "down")}
                    disabled={idx === sections.length - 1}
                    className="p-2 sm:p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Geser ke Bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleVisibility(idx)}
                    className="p-2 sm:p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white transition-colors"
                    title={sec.is_visible ? "Sembunyikan Blok" : "Tampilkan Blok"}
                  >
                    {sec.is_visible ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => openJsonEditor(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                      activeEditingId === sec.id
                        ? "bg-netflix-red text-white border-netflix-red"
                        : "bg-neutral-900 hover:bg-neutral-800 text-gray-300 border-neutral-700"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Edit Data</span>
                  </button>
                  <button
                    onClick={() => deleteSection(idx)}
                    className="p-2 sm:p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950 text-gray-400 hover:text-rose-400 transition-colors"
                    title="Hapus Blok"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Block Toolbar */}
          <div className="pt-4 border-t border-netflix-border/80">
            <span className="text-xs font-semibold text-gray-400 block mb-2">
              + Tambahkan Blok Komponen:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { type: "banner", label: "Banner" },
                { type: "story", label: "Story / Episodes" },
                { type: "schedule", label: "Schedule" },
                { type: "gallery", label: "Gallery" },
                { type: "donation", label: "Digital Gift" },
                { type: "guestbook", label: "Guestbook" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => addBlock(btn.type as SectionType)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-700 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3 text-netflix-red" />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: JSON Content Editor Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-netflix-dark/90 border border-netflix-border/80 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-netflix-border">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-netflix-red" />
              <h3 className="text-sm font-bold text-white">Content JSON Editor</h3>
            </div>
            {activeEditingId && (
              <span className="text-[10px] bg-netflix-red/20 text-netflix-red px-2 py-0.5 rounded font-mono font-bold">
                Editing #{activeEditingId.slice(0, 6)}
              </span>
            )}
          </div>

          {activeEditingId ? (
            <div className="mt-4 space-y-3">
              <p className="text-[11px] text-gray-400">
                Ubah data teks, foto, url audio, atau nomor rekening langsung pada struktur JSON di bawah:
              </p>
              <textarea
                rows={16}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full bg-black/90 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-netflix-red resize-y"
              />
              {jsonError && (
                <div className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800">
                  {jsonError}
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveEditingId(null)}
                  className="px-3.5 py-1.5 text-xs text-gray-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={saveJsonEditor}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow transition-colors"
                >
                  Terapkan ke Blok
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500 text-xs">
              Pilih salah satu blok di sebelah kiri lalu klik &ldquo;<strong>Edit Data</strong>&rdquo; untuk mengubah isi teks, gambar, jadwal, atau nomor rekening.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

