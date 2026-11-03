import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminConfigured,
  safeEqual,
  sessionCookieName,
  SESSION_TTL_SECONDS,
  verifyPassword,
} from "@/lib/security/session";
import {
  errorResponse,
  getClientIp,
  isSameOrigin,
  notFoundResponse,
  readJson,
  serverErrorResponse,
} from "@/lib/security/request-guard";
import { rateLimit, resetRateLimit } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

const INVALID_CREDENTIALS = "Invalid username or password.";

/** Sign in. */
export async function POST(req: NextRequest) {
  if (!isAdminConfigured() || !isSameOrigin(req)) return notFoundResponse();

  const ip = getClientIp(req);
  const limitKey = `login:${ip}`;
  const limit = rateLimit(limitKey, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  try {
    const body = await readJson<{ username?: unknown; password?: unknown }>(req, 2_000);
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password || username.length > 100 || password.length > 200) {
      return errorResponse(INVALID_CREDENTIALS, 401);
    }

    // Always run the password check so response time does not reveal valid usernames.
    const passwordOk = await verifyPassword(password);
    const usernameOk = safeEqual(username, process.env.ADMIN_USERNAME || "");
    if (!passwordOk || !usernameOk) {
      return errorResponse(INVALID_CREDENTIALS, 401);
    }

    resetRateLimit(limitKey);
    const response = NextResponse.json({ success: true });
    response.cookies.set(sessionCookieName(), await createSessionToken(username), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (err) {
    return serverErrorResponse("session:POST", err);
  }
}

/** Sign out. */
export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return notFoundResponse();
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
