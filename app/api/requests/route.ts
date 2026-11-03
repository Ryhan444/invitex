import { NextRequest, NextResponse } from "next/server";
import {
  submitCreationRequest,
  getAllRequests,
  updateRequestStatus,
} from "@/lib/data/events";
import {
  errorResponse,
  getAdminFromRequest,
  getClientIp,
  isSameOrigin,
  notFoundResponse,
  readJson,
  serverErrorResponse,
} from "@/lib/security/request-guard";
import { rateLimit } from "@/lib/security/rate-limit";
import {
  cleanHttpsUrl,
  cleanText,
  EVENT_TYPES,
  isOneOf,
  isValidDate,
  isValidEmail,
  isValidPhone,
  isValidSlug,
  SECTION_TYPES,
} from "@/lib/security/validation";

export const dynamic = "force-dynamic";

/** Admin only: list all requests (contains client contact data). */
export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return notFoundResponse();
  try {
    const requests = await getAllRequests();
    return NextResponse.json(
      { success: true, data: requests },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return serverErrorResponse("requests:GET", err);
  }
}

/** Public: submit a new invitation request. */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);

  const limit = rateLimit(`request:${getClientIp(req)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests submitted. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const body = await readJson<Record<string, any>>(req, 16_000);
    if (!body) return errorResponse("Invalid request body.");

    const clientName = cleanText(body.client_name, 100);
    const clientEmail = cleanText(body.client_email, 254).toLowerCase();
    const clientPhone = cleanText(body.client_phone, 20);
    const eventType = isOneOf(EVENT_TYPES, body.event_type) ? body.event_type : "wedding";
    const payload = (body.payload_data && typeof body.payload_data === "object" ? body.payload_data : {}) as Record<string, unknown>;

    if (!clientName || !clientEmail || !clientPhone) {
      return errorResponse("Name, email and WhatsApp number are required.");
    }
    if (!isValidEmail(clientEmail)) return errorResponse("Please enter a valid email address.");
    if (!isValidPhone(clientPhone)) return errorResponse("Please enter a valid WhatsApp number.");

    const eventTitle = cleanText(payload.event_title, 150);
    if (!eventTitle) return errorResponse("Event title is required.");
    if (!isValidDate(payload.target_date)) return errorResponse("Please enter a valid event date.");

    const preferredSlug = cleanText(payload.preferred_slug, 80).toLowerCase();
    if (preferredSlug && !isValidSlug(preferredSlug)) {
      return errorResponse("Custom link may only contain lowercase letters, numbers and hyphens (3–80 characters).");
    }

    const selectedBlocks = Array.isArray(payload.selected_blocks)
      ? Array.from(new Set(payload.selected_blocks.filter((b) => isOneOf(SECTION_TYPES, b))))
      : [];

    const newRequest = await submitCreationRequest({
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      event_type: eventType,
      payload_data: {
        event_title: eventTitle,
        target_date: payload.target_date as string,
        preferred_slug: preferredSlug,
        notes: cleanText(payload.notes, 2000),
        backdrop_url: cleanHttpsUrl(payload.backdrop_url),
        selected_blocks: selectedBlocks.length > 0 ? selectedBlocks : ["banner", "guestbook"],
      },
    });

    // Only echo back non-sensitive fields.
    return NextResponse.json({ success: true, data: { id: newRequest.id, status: newRequest.status } });
  } catch (err) {
    return serverErrorResponse("requests:POST", err);
  }
}

/** Admin only: approve / reject a request. */
export async function PATCH(req: NextRequest) {
  if (!(await getAdminFromRequest(req)) || !isSameOrigin(req)) return notFoundResponse();
  try {
    const body = await readJson<{ id?: unknown; status?: unknown }>(req, 2_000);
    const id = cleanText(body?.id, 100);
    const status = body?.status;

    if (!id || (status !== "approved" && status !== "rejected")) {
      return errorResponse("A valid request ID and status are required.");
    }

    const updated = await updateRequestStatus(id, status);
    if (!updated) return errorResponse("Request not found.", 404);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return serverErrorResponse("requests:PATCH", err);
  }
}
