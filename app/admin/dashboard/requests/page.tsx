"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { CreationRequest, RequestStatus } from "@/types";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<CreationRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (json.data) {
        setRequests(json.data);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: RequestStatus) => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-serif">
            USER REQUESTS & VERIFIKASI
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Tinjau data permohonan pembuatan undangan dan otomatiskan pembuatan halaman publik.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-netflix-border">
          {["all", "pending", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === st
                  ? "bg-netflix-red text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Memuat daftar permohonan...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-netflix-dark/60 border border-netflix-border rounded-2xl p-12 text-center text-gray-400">
          Tidak ada permohonan dengan status &ldquo;{filter}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((req) => {
            const payload = req.payload_data || {};
            const isPending = req.status === "pending";
            const isApproved = req.status === "approved";
            const generatedSlug =
              payload.preferred_slug ||
              `event-${req.client_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

            return (
              <div
                key={req.id}
                className="bg-netflix-dark/90 border border-netflix-border/80 rounded-2xl p-6 shadow-xl hover:border-neutral-600 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Column: Client & Event Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          req.status === "approved"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : req.status === "rejected"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        Acara: <strong className="text-white capitalize">{req.event_type}</strong>
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {payload.event_title || `${req.client_name}'s Event`}
                    </h3>

                    {/* Client contacts */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                      <span className="font-semibold text-white">
                        Pemesan: {req.client_name}
                      </span>
                      <a
                        href={`mailto:${req.client_email}`}
                        className="flex items-center gap-1 text-gray-400 hover:text-white"
                      >
                        <Mail className="w-3.5 h-3.5 text-netflix-red" />
                        {req.client_email}
                      </a>
                      <a
                        href={`https://wa.me/${req.client_phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {req.client_phone} (WhatsApp)
                      </a>
                    </div>

                    {/* Target date */}
                    {payload.target_date && (
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Calendar className="w-3.5 h-3.5 text-netflix-red" />
                        <span>Target Premiere: {new Date(payload.target_date).toLocaleString("id-ID")}</span>
                      </div>
                    )}

                    {/* Notes */}
                    {payload.notes && (
                      <div className="p-3 bg-neutral-900 rounded-lg text-xs text-gray-300 italic border border-neutral-800">
                        &ldquo;{payload.notes}&rdquo;
                      </div>
                    )}

                    {/* Selected blocks tags */}
                    {payload.selected_blocks && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {payload.selected_blocks.map((blk: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-neutral-800 text-gray-300 px-2 py-0.5 rounded border border-neutral-700 uppercase font-semibold"
                          >
                            {blk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 lg:w-48">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "approved")}
                          disabled={actionLoadingId === req.id}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Setujui & Generate
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          disabled={actionLoadingId === req.id}
                          className="w-full bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-gray-400 font-semibold py-2 px-4 rounded-xl text-xs border border-neutral-700 transition-colors"
                        >
                          Tolak Permohonan
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <div className="space-y-2">
                        <Link
                          href={`/${generatedSlug}`}
                          target="_blank"
                          className="w-full bg-netflix-red hover:bg-netflix-redHover text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Lihat Undangan Live
                        </Link>
                        <span className="text-[10px] text-emerald-400 block text-center font-medium">
                          ✓ Berhasil di-generate & tayang
                        </span>
                      </div>
                    )}

                    <a
                      href={`https://wa.me/${req.client_phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(req.client_name)},%20kami%20dari%20Inviteflix%20ingin%20mengonfirmasi%20undangan%20Anda`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-gray-300 font-semibold py-2 px-3 rounded-xl text-xs border border-neutral-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Chat WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

