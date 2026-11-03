import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, Send, Film, ArrowRight, Tv, MessageSquare, Music, Gift } from "lucide-react";
import { Navbar } from "@/components/netflix-ui/Navbar";
import { RowSlider } from "@/components/netflix-ui/RowSlider";
import { SiteFooter } from "@/components/netflix-ui/SiteFooter";
import { getPublishedEvents } from "@/lib/data/events";

export const revalidate = 60;

const FEATURES = [
  {
    icon: Film,
    accent: "bg-netflix-red/15 text-netflix-red",
    title: "Cinematic Billboard",
    desc: "A full-bleed hero with dramatic fades, bold typography and a play button that opens your invitation.",
  },
  {
    icon: Music,
    accent: "bg-violet-500/15 text-violet-300",
    title: "Background Soundtrack",
    desc: "Your chosen song starts the moment guests press play, with a floating player they can pause anytime.",
  },
  {
    icon: MessageSquare,
    accent: "bg-emerald-500/15 text-emerald-300",
    title: "Live Wishes & RSVP",
    desc: "Guests send wishes and confirm attendance, and every message appears instantly without a refresh.",
  },
  {
    icon: Tv,
    accent: "bg-amber-500/15 text-amber-300",
    title: "Story Episodes",
    desc: "Tell your journey as a series of episodes, complete with a schedule, countdown and venue map.",
  },
  {
    icon: Gift,
    accent: "bg-sky-500/15 text-sky-300",
    title: "Digital Gifts",
    desc: "Share bank accounts, e-wallets or a QRIS code with one-tap copy for guests who want to send a gift.",
  },
  {
    icon: Sparkles,
    accent: "bg-pink-500/15 text-pink-300",
    title: "Fully Customisable",
    desc: "Choose the blocks you need and reorder them. Your invitation can be updated at any time.",
  },
];

const STEPS = [
  { title: "Submit a request", desc: "Tell us about your event and pick the sections you want." },
  { title: "We produce it", desc: "Our team designs your invitation and contacts you on WhatsApp." },
  { title: "Share your link", desc: "Send your personal invitation link to every guest." },
];

export default async function LandingPage() {
  const events = await getPublishedEvents();

  const weddings = events.filter((e) => e.event_type === "wedding");
  const birthdays = events.filter((e) => e.event_type === "birthday");
  const others = events.filter((e) => e.event_type !== "wedding" && e.event_type !== "birthday");

  return (
    <div className="min-h-screen bg-netflix-black text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/70 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="bg-netflix-red text-white text-[11px] font-black tracking-widest px-2.5 py-1 rounded">
                PREMIERE
              </span>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-[0.2em]">
                Digital Invitations
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight font-serif leading-[0.95] mb-6 drop-shadow-2xl">
              Make your moment a cinematic masterpiece.
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed mb-9 max-w-xl">
              Turn your wedding, birthday or special event into a box-office premiere, with a live
              guestbook, a background soundtrack and instant RSVP.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reza-amanda-wedding"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-black hover:bg-white/85 px-7 py-3.5 rounded-lg font-bold text-sm sm:text-base transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </Link>
              <Link
                href="/request"
                className="inline-flex items-center justify-center gap-2 bg-neutral-500/40 hover:bg-neutral-500/60 text-white px-7 py-3.5 rounded-lg font-bold text-sm sm:text-base backdrop-blur-md transition-colors"
              >
                <Send className="w-4 h-4" />
                Request an Invitation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase rows */}
      <section className="relative z-20 -mt-20 sm:-mt-28 pb-12 space-y-2">
        <RowSlider
          title="Trending Weddings"
          subtitle="Romantic premieres with a cinematic touch"
          badge="Top 10"
          events={weddings.length > 0 ? weddings : events}
        />
        <RowSlider
          title="Birthdays & Celebrations"
          subtitle="Modern parties with an exclusive nightlife feel"
          badge="Popular"
          events={birthdays.length > 0 ? birthdays : events}
        />
        {others.length > 0 && (
          <RowSlider
            title="Graduations, Seminars & More"
            subtitle="Graduations, conferences and reunions"
            events={others}
          />
        )}
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24 bg-netflix-carbon border-y border-netflix-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-netflix-red">Features</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-serif mt-3">
              Why a Netflix-style invitation?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-4 leading-relaxed">
              Your guests don&apos;t just read the details. They get the feeling of attending a
              red-carpet gala premiere.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, accent, title, desc }) => (
              <div
                key={title}
                className="bg-netflix-dark border border-netflix-border/80 rounded-xl p-6 hover:border-neutral-600 transition-colors"
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl font-black uppercase tracking-tight font-serif mb-12">
            How it works
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative rounded-xl border border-netflix-border/80 bg-netflix-dark/60 p-6">
                <span className="text-5xl font-black font-serif text-netflix-red/80 leading-none">{i + 1}</span>
                <h3 className="text-lg font-bold mt-3 mb-1.5">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center rounded-2xl border border-netflix-border/80 bg-gradient-to-b from-netflix-dark to-netflix-black px-6 py-14 sm:py-16">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-serif mb-4">
            Ready for your premiere?
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Send us your event details. Our team will prepare your invitation and publish it on your own link.
          </p>
          <Link
            href="/request"
            className="inline-flex items-center gap-2 bg-netflix-red hover:bg-netflix-redHover text-white px-8 py-3.5 rounded-lg font-bold text-base shadow-xl shadow-red-900/30 transition-colors"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
