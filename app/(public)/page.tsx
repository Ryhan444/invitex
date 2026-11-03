import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, Send, ShieldCheck, Heart, Film, ArrowRight, CheckCircle2, Tv, Smartphone, Music } from "lucide-react";
import { Navbar } from "@/components/netflix-ui/Navbar";
import { RowSlider } from "@/components/netflix-ui/RowSlider";
import { getAllEvents } from "@/lib/data/events";

export const revalidate = 60; // revalidate every minute

export default async function LandingPage() {
  const allEvents = await getAllEvents();

  const weddings = allEvents.filter((e) => e.event_type === "wedding");
  const birthdays = allEvents.filter((e) => e.event_type === "birthday");
  const others = allEvents.filter(
    (e) => e.event_type !== "wedding" && e.event_type !== "birthday"
  );

  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col">
      {/* Netflix Top Navigation */}
      <Navbar />

      {/* Main Cinematic Hero Billboard */}
      <div className="relative min-h-[90vh] flex items-center justify-start overflow-hidden pt-20">
        {/* Billboard Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
            alt="Inviteflix Featured Premiere"
            fill
            priority
            className="object-cover object-center filter brightness-60"
          />
          {/* Netflix Signature Dark Vignette & Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/80 to-transparent w-full md:w-2/3" />
          <div className="absolute inset-0 bg-radial-netflix opacity-30 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl px-4 sm:px-8 lg:px-12 py-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-netflix-red text-white text-xs font-black tracking-widest px-2.5 py-0.5 rounded shadow">
              FILM PREMIERE
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-widest">
              Digital Invitation Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-serif leading-none mb-4 drop-shadow-2xl">
            MAKE YOUR MOMENT A CINEMATIC MASTERPIECE.
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl font-light mb-8 leading-relaxed">
            Ubah undangan pernikahan, ulang tahun, atau acaramu menjadi pengalaman film box office ala Netflix. Dilengkapi live chat ucapan realtime, background audio soundtrack, dan reservasi instan.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/reza-amanda-wedding"
              className="flex items-center gap-2.5 bg-netflix-red hover:bg-netflix-redHover text-white px-8 py-4 rounded font-black text-sm sm:text-base tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-current" />
              Tonton Demo Undangan
            </Link>

            <Link
              href="/request"
              className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white px-7 py-4 rounded font-bold text-sm sm:text-base backdrop-blur-md border border-neutral-700 transition-all duration-200"
            >
              <Send className="w-4 h-4 text-netflix-red" />
              Ajukan Pembuatan Undangan
            </Link>
          </div>

          {/* Metadata Highlights */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 mt-8">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              99% Match for Special Celebrations
            </span>
            <span>•</span>
            <span>Mobile & Desktop Optimized</span>
            <span>•</span>
            <span className="border border-gray-600 px-1.5 py-0.5 rounded text-gray-300">
              SUPABASE REALTIME
            </span>
            <span>•</span>
            <span className="border border-gray-600 px-1.5 py-0.5 rounded text-gray-300">
              BLOCK-BASED ENGINE
            </span>
          </div>
        </div>
      </div>

      {/* Netflix Movie Rows: Templates & Premieres */}
      <div className="relative z-20 -mt-10 sm:-mt-16 space-y-4 pb-16">
        <RowSlider
          title="Trending Wedding Premieres"
          subtitle="Pernikahan romantis bernuansa sinematik kelas dunia"
          badge="Top 10"
          events={weddings.length > 0 ? weddings : allEvents}
        />

        <RowSlider
          title="VIP Celebrations & Birthdays"
          subtitle="Pesta ulang tahun modern dengan sentuhan nightlife eksklusif"
          badge="Popular"
          events={birthdays.length > 0 ? birthdays : allEvents}
        />

        {others.length > 0 && (
          <RowSlider
            title="Conferences & Special Screenings"
            subtitle="Seminar, wisuda, dan temu alumni prestisius"
            events={others}
          />
        )}
      </div>

      {/* Cinematic Features Showcase */}
      <section className="py-20 bg-netflix-carbon border-t border-netflix-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-netflix-red bg-netflix-red/10 border border-netflix-red/20 px-3 py-1 rounded-full">
              Fitur Utama Inviteflix
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif mt-3">
              KENAPA MEMILIH UNDANGAN ALA NETFLIX?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-3">
              Tamu undangan Anda tidak sekadar membaca informasi, mereka merasakan pengalaman eksklusif layaknya menghadiri gala premiere film bioskop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-7 shadow-xl hover:border-netflix-red/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-netflix-red/20 flex items-center justify-center text-netflix-red mb-5">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cinematic Billboard & Audio</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Backdrop megah dengan efek fade dramatis, typography bold, dan pemutar musik instan saat tombol play ditekan.
              </p>
            </div>

            <div className="bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-7 shadow-xl hover:border-netflix-red/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Chat Ucapan Realtime</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Didukung Supabase Realtime Channel. Tamu bisa kirim doa dan konfirmasi RSVP yang langsung muncul tanpa refresh.
              </p>
            </div>

            <div className="bg-netflix-dark/80 border border-netflix-border/80 rounded-2xl p-7 shadow-xl hover:border-netflix-red/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dynamic Block Engine</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Modular & fleksibel. Blok cerita (episodes), rundown, galeri 4K, hingga rekening kado digital bebas diatur dan diubah kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 bg-gradient-to-b from-netflix-carbon to-netflix-black border-t border-netflix-border/40 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-serif mb-4">
            SIAP MEMBUAT UNDANGAN IMPIANMU?
          </h2>
          <p className="text-base text-gray-300 max-w-xl mx-auto mb-8">
            Kirimkan data acaramu melalui portal permohonan. Admin kami akan segera memproses dan menayangkan undanganmu di tautan eksklusif.
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-netflix-red hover:bg-netflix-redHover text-white px-9 py-4 rounded-xl font-black text-base shadow-2xl hover:scale-105 transition-all"
          >
            Mulai Ajukan Undangan
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-netflix-black border-t border-netflix-border text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold tracking-wider text-gray-400">
            INVITE<span className="text-netflix-red">FLIX</span> &copy; 2026. All rights reserved.
          </span>
          <div className="flex items-center space-x-6 text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/request" className="hover:text-white">Request Portal</Link>
            <Link href="/admin/login" className="hover:text-white">Admin Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

