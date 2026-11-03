import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/data/events";
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
import { cleanText, EVENT_TYPES, isOneOf, isValidDate, isValidSlug } from "@/lib/security/validation";

export const dynamic = "force-dynamic";

/** Admin only: list every event, including drafts. */
export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return notFoundResponse();
  try {
    const events = await getAllEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (err) {
    return serverErrorResponse("events:GET", err);
  }
}

/** Admin only: create an event. */
export async function POST(req: NextRequest) {
  if (!(await getAdminFromRequest(req)) || !isSameOrigin(req)) return notFoundResponse();
  try {
    const body = await readJson<Record<string, any>>(req, 16_000);
    if (!body) return errorResponse("Invalid request body.");

    const title = cleanText(body.title, 150);
    const slug = cleanText(body.slug, 80).toLowerCase();
    const eventType = isOneOf(EVENT_TYPES, body.event_type) ? body.event_type : "wedding";
    const eventDate = isValidDate(body.event_date) ? body.event_date : new Date().toISOString();
    const themeConfig =
      body.theme_config && typeof body.theme_config === "object" && !Array.isArray(body.theme_config)
        ? body.theme_config
        : {};
    const isPublished = typeof body.is_published === "boolean" ? body.is_published : true;

    if (!title || !slug) return errorResponse("Title and slug are required.");
    if (!isValidSlug(slug)) {
      return errorResponse("Slug may only contain lowercase letters, numbers and hyphens (3–80 characters).");
    }

    const record = {
      title,
      slug,
      event_type: eventType,
      event_date: eventDate,
      theme_config: themeConfig,
      is_published: isPublished,
    };

    if (isSupabaseConfigured()) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase.from("events").insert(record).select().single();
      if (error) {
        if (error.code === "23505") return errorResponse("That slug is already in use.", 409);
        throw error;
      }
      return NextResponse.json({ success: true, data });
    }

    // Demo fallback response
    return NextResponse.json({ success: true, data: { id: `ev-${Date.now()}`, ...record } });
  } catch (err) {
    return serverErrorResponse("events:POST", err);
  }
}
