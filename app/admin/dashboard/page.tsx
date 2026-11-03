import React from "react";
import Link from "next/link";
import {
  Film,
  PlusCircle,
  ExternalLink,
  Edit,
  Inbox,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { getAllEvents, getAllRequests } from "@/lib/data/events";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const events = await getAllEvents();
  const requests = await getAllRequests();

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.is_published).length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-serif">
            STUDIO DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Kelola penayangan undangan film digital dan tinjau pengajuan tamu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/dashboard/requests"
            className="flex-1 sm:flex-none justify-center bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-700 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Inbox className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Tinjau Request ({pendingRequests})</span>
          </Link>
          <Link
            href="/admin/dashboard/events/create"
            className="flex-1 sm:flex-none justify-center bg-netflix-red hover:bg-netflix-redHover text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-red-900/30"
          >
            <PlusCircle className="w-4 h-4 flex-shrink-0" />
            <span>Buat Event Baru</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-3.5 sm:p-5 shadow-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 block truncate">
            Total Undangan
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {totalEvents}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1 block truncate">
            Semua premiere terdaftar
          </span>
        </div>

        <div className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-3.5 sm:p-5 shadow-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 block truncate">
            Status Published
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
            {publishedEvents}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1 block truncate">
            Dapat diakses tamu
          </span>
        </div>

        <div className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-3.5 sm:p-5 shadow-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 block truncate">
            Pending Requests
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
            {pendingRequests}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1 block truncate">
            Menunggu verifikasi admin
          </span>
        </div>

        <div className="bg-netflix-dark/90 border border-netflix-border/80 rounded-xl p-3.5 sm:p-5 shadow-lg">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 block truncate">
            Total Requests
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {requests.length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-500 mt-1 block truncate">
            Dari portal /request
          </span>
        </div>
      </div>

      {/* Events List / Table */}
      <div className="bg-netflix-dark/90 border border-netflix-border/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-netflix-border flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-netflix-red" />
            Daftar Acara & Undangan Aktif
          </h2>
          <span className="text-xs text-gray-400">
            {events.length} Judul
          </span>
        </div>

        {/* Mobile View: Cards (< sm) */}
        <div className="block sm:hidden divide-y divide-netflix-border/60">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-1">{ev.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] text-netflix-lightGray bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                      /{ev.slug}
                    </span>
                    <span className="uppercase text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-netflix-red/10 text-netflix-red border border-netflix-red/20">
                      {ev.event_type}
                    </span>
                  </div>
                </div>
                {ev.is_published ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-neutral-800 px-2 py-0.5 rounded-full flex-shrink-0">
                    Draft
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>{new Date(ev.event_date).toLocaleDateString("id-ID")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/${ev.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-200"
                    title="Buka Halaman Publik"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admin/dashboard/events/${ev.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-netflix-red text-white text-xs font-bold shadow-md shadow-red-900/30"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Blok</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-900/80 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-netflix-border">
              <tr>
                <th className="py-3.5 px-5">Judul Undangan</th>
                <th className="py-3.5 px-5">Slug / Tautan</th>
                <th className="py-3.5 px-5">Kategori</th>
                <th className="py-3.5 px-5">Tanggal Penayangan</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-netflix-border text-gray-300">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-white line-clamp-1">{ev.title}</div>
                    <div className="text-[11px] text-gray-400">
                      ID: <span className="font-mono">{ev.id.slice(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-xs text-netflix-lightGray bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                      /{ev.slug}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-netflix-red/10 text-netflix-red border border-netflix-red/20">
                      {ev.event_type}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span>{new Date(ev.event_date).toLocaleDateString("id-ID")}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    {ev.is_published ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${ev.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white transition-colors"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/dashboard/events/${ev.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-netflix-red hover:text-white text-gray-300 text-xs font-semibold transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Blok</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
