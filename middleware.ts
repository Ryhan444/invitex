import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminBasePath,
  isAdminConfigured,
  sessionCookieName,
  verifySessionToken,
} from "@/lib/security/session";

// Any path without a matching route renders the standard 404 page, so hidden
// admin URLs look exactly like a non-existent page.
const NOT_FOUND_PATH = "/admin/__not-found";

function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), { status: 404 });
}

function withPrivateHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The internal /admin route tree is never reachable directly.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return notFound(request);
  }

  const basePath = getAdminBasePath();
  if (!basePath || (pathname !== basePath && !pathname.startsWith(`${basePath}/`))) {
    return NextResponse.next();
  }

  if (!isAdminConfigured()) return notFound(request);

  const rest = pathname.slice(basePath.length) || "/";
  const user = await verifySessionToken(request.cookies.get(sessionCookieName())?.value);

  // Login screen lives at the secret base path itself.
  if (rest === "/" || rest === "/login") {
    if (user) {
      return NextResponse.redirect(new URL(`${basePath}/dashboard`, request.url));
    }
    return withPrivateHeaders(NextResponse.rewrite(new URL("/admin/login", request.url)));
  }

  if (rest === "/dashboard" || rest.startsWith("/dashboard/")) {
    if (!user) {
      return withPrivateHeaders(NextResponse.redirect(new URL(basePath, request.url)));
    }
    return withPrivateHeaders(NextResponse.rewrite(new URL(`/admin${rest}`, request.url)));
  }

  return notFound(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp3|txt)$).*)"],
};
