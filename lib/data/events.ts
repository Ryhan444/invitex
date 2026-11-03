import { EventItem, EventSection, GuestWish, CreationRequest } from "@/types";
import { DEMO_EVENTS, DEMO_WISHES, DEMO_REQUESTS } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

// Global in-memory cache for dynamic mutations during development / demo sessions
let memoryEvents: Record<string, EventItem> = { ...DEMO_EVENTS };
let memoryWishes: Record<string, GuestWish[]> = { ...DEMO_WISHES };
let memoryRequests: CreationRequest[] = [...DEMO_REQUESTS];

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  if (!isSupabaseConfigured()) {
    return memoryEvents[slug] || null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (eventErr || !event) {
      // Fallback to demo if not found in db
      return memoryEvents[slug] || null;
    }

    const { data: sections, error: secErr } = await supabase
      .from("event_sections")
      .select("*")
      .eq("event_id", event.id)
      .order("order_index", { ascending: true });

    return {
      ...event,
      sections: (sections as EventSection[]) || [],
    };
  } catch (err) {
    console.error("Error fetching event by slug:", err);
    return memoryEvents[slug] || null;
  }
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) {
    return Object.values(memoryEvents);
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return Object.values(memoryEvents);
    }
    return data as EventItem[];
  } catch {
    return Object.values(memoryEvents);
  }
}

export async function getEventById(id: string): Promise<EventItem | null> {
  if (!isSupabaseConfigured()) {
    const found = Object.values(memoryEvents).find((e) => e.id === id);
    return found || null;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !event) {
      const found = Object.values(memoryEvents).find((e) => e.id === id);
      return found || null;
    }

    const { data: sections } = await supabase
      .from("event_sections")
      .select("*")
      .eq("event_id", id)
      .order("order_index", { ascending: true });

    return {
      ...event,
      sections: (sections as EventSection[]) || [],
    };
  } catch {
    const found = Object.values(memoryEvents).find((e) => e.id === id);
    return found || null;
  }
}

export async function getGuestWishes(eventId: string): Promise<GuestWish[]> {
  if (!isSupabaseConfigured()) {
    return memoryWishes[eventId] || [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("guest_wishes")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return memoryWishes[eventId] || [];
    }
    return data as GuestWish[];
  } catch {
    return memoryWishes[eventId] || [];
  }
}

export async function addGuestWish(wish: {
  event_id: string;
  name: string;
  attendance_status: "attending" | "not_attending" | "tentative";
  message: string;
}): Promise<GuestWish> {
  const newWish: GuestWish = {
    id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event_id: wish.event_id,
    name: wish.name,
    attendance_status: wish.attendance_status,
    message: wish.message,
    created_at: new Date().toISOString(),
  };

  // Always update in-memory for instant feedback
  if (!memoryWishes[wish.event_id]) {
    memoryWishes[wish.event_id] = [];
  }
  memoryWishes[wish.event_id].unshift(newWish);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("guest_wishes")
        .insert({
          event_id: wish.event_id,
          name: wish.name,
          attendance_status: wish.attendance_status,
          message: wish.message,
        })
        .select()
        .single();

      if (!error && data) {
        return data as GuestWish;
      }
    } catch (err) {
      console.error("Supabase insert wish error:", err);
    }
  }

  return newWish;
}

export async function getAllRequests(): Promise<CreationRequest[]> {
  if (!isSupabaseConfigured()) {
    return memoryRequests;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("creation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return memoryRequests;
    }
    return data as CreationRequest[];
  } catch {
    return memoryRequests;
  }
}

export async function submitCreationRequest(payload: {
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  payload_data: any;
}): Promise<CreationRequest> {
  const newReq: CreationRequest = {
    id: `req-${Date.now()}`,
    client_name: payload.client_name,
    client_email: payload.client_email,
    client_phone: payload.client_phone,
    event_type: payload.event_type,
    payload_data: payload.payload_data,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  memoryRequests.unshift(newReq);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("creation_requests")
        .insert({
          client_name: payload.client_name,
          client_email: payload.client_email,
          client_phone: payload.client_phone,
          event_type: payload.event_type,
          payload_data: payload.payload_data,
          status: "pending",
        })
        .select()
        .single();

      if (!error && data) {
        return data as CreationRequest;
      }
    } catch (err) {
      console.error("Error creating request in Supabase:", err);
    }
  }

  return newReq;
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: "approved" | "rejected"
): Promise<CreationRequest | null> {
  const req = memoryRequests.find((r) => r.id === requestId);
  if (req) {
    req.status = newStatus;

    // If approved, create or publish the event!
    if (newStatus === "approved") {
      const slug =
        req.payload_data.preferred_slug ||
        `event-${req.client_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;
      
      const newEventId = `ev-${Date.now()}`;
      const newEvent: EventItem = {
        id: newEventId,
        slug,
        title: req.payload_data.event_title || `${req.client_name}'s Special Event`,
        event_type: (req.event_type as any) || "wedding",
        event_date: req.payload_data.target_date || new Date().toISOString(),
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        theme_config: {
          primary_color: "#E50914",
          bg_color: "#141414",
          font_family: "Bebas Neue",
          audio_url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
          audio_title: "Cinematic Event Theme",
          match_rate: "99% Match",
          maturity_rating: "ALL AGES",
          season_badge: "Official Premiere",
        },
        sections: [
          {
            id: `sec-${Date.now()}-1`,
            event_id: newEventId,
            type: "banner",
            order_index: 0,
            is_visible: true,
            content: {
              badge: "AN INVITEFLIX ORIGINAL PREMIERE",
              title: req.payload_data.event_title || req.client_name,
              subtitle: req.payload_data.notes || "You are cordially invited to celebrate with us.",
              backdrop_url: req.payload_data.backdrop_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
              cta_text: "Buka Undangan (Play)",
              rating: "99% Match",
              year: new Date().getFullYear().toString(),
              season: "Season 1",
            },
          },
          {
            id: `sec-${Date.now()}-2`,
            event_id: newEventId,
            type: "guestbook",
            order_index: 1,
            is_visible: true,
            content: {
              heading: "GUEST WISHES & RSVP",
              subheading: "Tinggalkan doa dan konfirmasi kehadiran Anda.",
              rsvp_enabled: true,
            },
          },
        ],
      };

      memoryEvents[slug] = newEvent;
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data } = await supabase
        .from("creation_requests")
        .update({ status: newStatus })
        .eq("id", requestId)
        .select()
        .single();

      return data as CreationRequest;
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  }

  return req || null;
}

export async function saveEventSections(
  eventId: string,
  sections: EventSection[]
) {
  // Update memory
  for (const slug in memoryEvents) {
    if (memoryEvents[slug].id === eventId) {
      memoryEvents[slug].sections = sections;
      break;
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseAdminClient();
      // Update each section
      for (const sec of sections) {
        await supabase
          .from("event_sections")
          .upsert({
            id: sec.id.startsWith("sec-") ? undefined : sec.id,
            event_id: eventId,
            type: sec.type,
            order_index: sec.order_index,
            is_visible: sec.is_visible,
            content: sec.content,
          });
      }
    } catch (err) {
      console.error("Error saving event sections:", err);
    }
  }
}

