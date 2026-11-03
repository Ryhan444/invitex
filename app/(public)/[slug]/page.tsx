import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Film } from "lucide-react";
import { getEventBySlug, getGuestWishes } from "@/lib/data/events";
import { InvitationClientView } from "@/components/dynamic-blocks/InvitationClientView";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found - Inviteflix",
    };
  }

  const banner = event.sections?.find((s) => s.type === "banner");
  const posterUrl =
    banner?.content?.backdrop_url ||
    banner?.content?.poster_url ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${event.title} - Inviteflix Premiere`,
    description:
      banner?.content?.subtitle ||
      `Undangan resmi untuk ${event.title}. Saksikan premiere momen spesial ini di Inviteflix.`,
    openGraph: {
      title: event.title,
      description: banner?.content?.subtitle || "Undangan digital sinematik ala Netflix.",
      images: [{ url: posterUrl }],
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { to } = await searchParams;

  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-netflix-red/10 border border-netflix-red/30 flex items-center justify-center text-netflix-red mb-6">
          <Film className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase font-serif tracking-tight mb-3">
          TITLE NOT AVAILABLE
        </h1>
        <p className="text-gray-400 max-w-md text-sm sm:text-base mb-8">
          Undangan dengan tautan &ldquo;<span className="text-white font-mono">{slug}</span>&rdquo; belum dipublikasikan atau sedang dalam proses penyuntingan sutradara.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-netflix-red hover:bg-netflix-redHover text-white px-6 py-3 rounded-lg font-bold text-sm"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/reza-amanda-wedding"
            className="bg-neutral-800 hover:bg-neutral-700 text-gray-200 px-6 py-3 rounded-lg font-semibold text-sm border border-neutral-700"
          >
            Lihat Demo Undangan
          </Link>
        </div>
      </div>
    );
  }

  const initialWishes = await getGuestWishes(event.id);

  return (
    <InvitationClientView
      event={event}
      initialWishes={initialWishes}
      guestName={to}
    />
  );
}

