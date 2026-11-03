import { NextRequest, NextResponse } from "next/server";
import { getEventById, saveEventSections } from "@/lib/data/events";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  errorResponse,
  getAdminFromRequest,
  isSameOrigin,
  notFoundResponse,
  readJson,
  serverErrorResponse,
} from "@/lib/security/request-guard";
import {
  cleanText,
  EVENT_TYPES,
  isOneOf,
  isValidDate,
  isValidSlug,
  SECTION_TYPES,
} from "@/lib/security/validation";
import { EventSection } from "@/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Admin only: fetch a single event with its sections. */
export async function GET(req: NextRequest, { params }: Params) {
  if (!(await getAdminFromRequest(req))) return notFoundResponse();
  const { id } = await params;
  try {
    const event = await getEventById(cleanText(id, 100));
    if (!event) return errorResponse("Event not found.", 404);
    return NextResponse.json({ success: true, data: event });
  } catch (err) {
    return serverErrorResponse("events/[id]:GET", err);
  }
}

/** Admin only: update event metadata and/or sections. */
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await getAdminFromRequest(req)) || !isSameOrigin(req)) return notFoundResponse();
  const { id: rawId } = await params;
  const id = cleanText(rawId, 100);

  try {
    // Sections can contain long story text / many gallery URLs.
    const body = await readJson<{ event?: Record<string, any>; sections?: unknown }>(req, 512_000);
    if (!body) return errorResponse("Invalid request body.");
    const { event, sections } = body;

    if (sections !== undefined) {
      if (!Array.isArray(sections) || sections.length > 50) {
        return errorResponse("Invalid sections payload.");
      }
      const valid = sections.every(
        (s: any) =>
          s &&
          typeof s === "object" &&
          isOneOf(SECTION_TYPES, s.type) &&
          typeof s.id === "string" &&
          Number.isInteger(s.order_index) &&
          typeof s.is_visible === "boolean" &&
          s.content &&
          typeof s.content === "object"
      );
      if (!valid) return errorResponse("Invalid sections payload.");
      await saveEventSections(id, sections as EventSection[]);
    }

    if (event && isSupabaseConfigured()) {
      const slug = cleanText(event.slug, 80).toLowerCase();
      if (!isValidSlug(slug)) {
        return errorResponse("Slug may only contain lowercase letters, numbers and hyphens (3–80 characters).");
      }
      const title = cleanText(event.title, 150);
      if (!title) return errorResponse("Title is required.");

      const supabase = createSupabaseAdminClient();
      const { error } = await supabase
        .from("events")
        .update({
          title,
          slug,
          event_type: isOneOf(EVENT_TYPES, event.event_type) ? event.event_type : "wedding",
          event_date: isValidDate(event.event_date) ? event.event_date : undefined,
          theme_config:
            event.theme_config && typeof event.theme_config === "object" ? event.theme_config : {},
          is_published: Boolean(event.is_published),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) {
        if (error.code === "23505") return errorResponse("That slug is already in use.", 409);
        throw error;
      }
    }

    return NextResponse.json({ success: true, message: "Saved successfully." });
  } catch (err) {
    return serverErrorResponse("events/[id]:PUT", err);
  }
}
