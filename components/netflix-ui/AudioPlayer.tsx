"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Disc } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  audioTitle?: string;
  autoPlayTrigger?: boolean;
}

export function AudioPlayer({
  audioUrl = "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
  audioTitle = "Cinematic Theme Soundtrack",
  autoPlayTrigger = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          // Autoplay policy might block unmuted audio initially until guest interaction
          console.log("Audio play blocked by browser policy:", err);
        });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play failed:", err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />

      {/* Floating Pill Player */}
      <div className="flex items-center gap-2 bg-netflix-dark/90 backdrop-blur-md border border-netflix-border/80 px-3.5 py-2 rounded-full shadow-2xl hover:border-netflix-red/60 transition-all duration-300 group">
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? "bg-netflix-red text-white shadow-lg shadow-red-600/30 animate-pulse-slow"
              : "bg-neutral-800 text-gray-300 hover:text-white"
          }`}
          title={isPlaying ? "Pause Music" : "Play Music"}
          aria-label="Toggle Background Music"
        >
          {isPlaying ? (
            <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
          ) : (
            <Music className="w-4 h-4" />
          )}
        </button>

        {/* Audio Wave Visualizer & Title */}
        <div className="hidden sm:flex flex-col pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-gray-200 tracking-wide max-w-[130px] truncate">
              {audioTitle}
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-netflix-red animate-pulse" />
                <span className="w-0.5 h-2 bg-netflix-red animate-bounce" />
                <span className="w-0.5 h-3 bg-netflix-red animate-pulse" />
              </div>
            )}
          </div>
          <span className="text-[9px] text-gray-400">Inviteflix Audio Engine</span>
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white p-1 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

