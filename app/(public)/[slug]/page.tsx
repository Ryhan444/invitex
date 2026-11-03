import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getEventBySlug, getGuestWishes } from "@/lib/data/events";
import { getAdminFromCookies } from "@/lib/security/request-guard";
import { SLUG_PATTERN } from "@/lib/security/validation";
import { InvitationClientView } from "@/components/dynamic-blocks/InvitationClientView";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

/**
 * Loads an event that the current visitor is allowed to see.
 * Draft events are only visible to a signed-in admin (preview).
 */
const loadVisibleEvent = cache(async (slug: string) => {
  if (slug.length > 80 || !SLUG_PATTERN.test(slug)) return null;
  const event = await getEventBySlug(slug);
  if (!event) return null;
  if (!event.is_published && !(await getAdminFromCookies())) return null;
  return event;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await loadVisibleEvent(slug);
  if (!event) return { title: "Not Found" };

  const banner = event.sections?.find((s) => s.type === "banner");
  const posterUrl =
    banner?.content?.backdrop_url ||
    banner?.content?.poster_url ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";
  const description =
    banner?.content?.subtitle || `You're invited to ${event.title}. Watch the premiere on Inviteflix.`;

  return {
    title: event.title,
    description,
    robots: event.is_published ? undefined : { index: false, follow: false },
    openGraph: { title: event.title, description, images: [{ url: posterUrl }] },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { to } = await searchParams;

  const event = await loadVisibleEvent(slug);
  if (!event) notFound();

  const initialWishes = await getGuestWishes(event.id);
  const guestName = typeof to === "string" ? to.trim().slice(0, 80) : undefined;

  return <InvitationClientView event={event} initialWishes={initialWishes} guestName={guestName} />;
}
