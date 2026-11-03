"use client";

import React, { useState } from "react";
import { BlockRenderer } from "./BlockRenderer";
import { AudioPlayer } from "@/components/netflix-ui/AudioPlayer";
import { Navbar } from "@/components/netflix-ui/Navbar";
import { EventItem, GuestWish } from "@/types";
import { UserCheck, Share2, Copy, Check } from "lucide-react";

interface InvitationClientViewProps {
  event: EventItem;
  initialWishes?: GuestWish[];
  guestName?: string;
}

export function InvitationClientView({
  event,
  initialWishes = [],
  guestName,
}: InvitationClientViewProps) {
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleOpenInvitation = () => {
    setHasStartedAudio(true);
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const audioUrl =
    event.theme_config?.audio_url ||
    "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3";
  const audioTitle =
    event.theme_config?.audio_title || "Cinematic Original Soundtrack";

  return (
    <main className="min-h-screen bg-netflix-black text-white relative">
      {/* Top Navbar */}
      <Navbar customTitle={event.title} isInvitation={true} />

      {/* Guest Personalized VIP Notice if 'to' param is present */}
      {guestName && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-md bg-netflix-dark/95 border border-netflix-red/60 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs sm:text-sm animate-pulse-slow">
          <UserCheck className="w-4 h-4 text-netflix-red flex-shrink-0" />
          <span className="truncate">
            Kepada Yth. Tamu VIP: <strong className="text-white">{guestName}</strong>
          </span>
        </div>
      )}

      {/* Dynamic Blocks Renderer */}
      <div id="invitation-hero">
        <BlockRenderer
          sections={event.sections || []}
          eventId={event.id}
          eventDate={event.event_date}
          initialWishes={initialWishes}
          onOpenInvitation={handleOpenInvitation}
        />
      </div>

      {/* Floating Audio Player */}
      <AudioPlayer
        audioUrl={audioUrl}
        audioTitle={audioTitle}
        autoPlayTrigger={hasStartedAudio}
      />

      {/* Bottom Floating Quick Actions Bar */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2">
        <button
          onClick={handleShareLink}
          className="bg-netflix-dark/95 hover:bg-neutral-800 border border-netflix-border px-3 sm:px-3.5 py-2 rounded-full shadow-2xl text-xs font-semibold text-gray-200 flex items-center gap-2 backdrop-blur-md transition-all active:scale-95"
          title="Salin Tautan Undangan"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-netflix-red" />
              <span className="hidden sm:inline">Bagikan Undangan</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-netflix-carbon border-t border-netflix-border/40 text-center text-xs text-gray-500">
        <p className="tracking-wide">
          Official Invitation Powered by{" "}
          <span className="font-bold text-white">
            INVITE<span className="text-netflix-red">FLIX</span>
          </span>
        </p>
      </footer>
    </main>
  );
}

