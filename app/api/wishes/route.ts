import { NextRequest, NextResponse } from "next/server";
import { addGuestWish, getEventById } from "@/lib/data/events";
import {
  errorResponse,
  getClientIp,
  isSameOrigin,
  readJson,
  serverErrorResponse,
} from "@/lib/security/request-guard";
import { rateLimit } from "@/lib/security/rate-limit";
import { ATTENDANCE_STATUSES, cleanText, isOneOf } from "@/lib/security/validation";

export const dynamic = "force-dynamic";

/** Public: post a guest wish / RSVP. */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);

  const limit = rateLimit(`wish:${getClientIp(req)}`, 10, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "You are sending messages too quickly. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const body = await readJson<Record<string, unknown>>(req, 4_000);
    if (!body) return errorResponse("Invalid request body.");

    const eventId = cleanText(body.event_id, 100);
    const name = cleanText(body.name, 80);
    const message = cleanText(body.message, 500);
    const attendance = isOneOf(ATTENDANCE_STATUSES, body.attendance_status)
      ? body.attendance_status
      : "attending";

    if (!eventId || !name || !message) {
      return errorResponse("Name and message are required.");
    }

    const event = await getEventById(eventId);
    if (!event || !event.is_published) return errorResponse("Event not found.", 404);

    const wish = await addGuestWish({
      event_id: eventId,
      name,
      attendance_status: attendance,
      message,
    });

    return NextResponse.json({ success: true, data: wish });
  } catch (err) {
    return serverErrorResponse("wishes:POST", err);
  }
}
