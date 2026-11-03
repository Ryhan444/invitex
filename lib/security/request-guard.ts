import "server-only";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName, verifySessionToken } from "./session";

/** Generic 404 so unauthenticated callers cannot tell protected endpoints exist. */
export function notFoundResponse() {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Logs the real error server-side and returns a generic message to the client. */
export function serverErrorResponse(context: string, err: unknown) {
  console.error(`[${context}]`, err);
  return NextResponse.json(
    { error: "Something went wrong. Please try again later." },
    { status: 500 }
  );
}

/** Returns the admin username for a valid session, otherwise null. */
export async function getAdminFromRequest(req: NextRequest): Promise<string | null> {
  return verifySessionToken(req.cookies.get(sessionCookieName())?.value);
}

/** For Server Components / layouts. */
export async function getAdminFromCookies(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(sessionCookieName())?.value);
}

/**
 * Rejects cross-site state-changing requests (CSRF defence in depth on top of
 * SameSite=Strict cookies).
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function readJson<T = Record<string, unknown>>(
  req: NextRequest,
  maxBytes = 32_000
): Promise<T | null> {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
}
