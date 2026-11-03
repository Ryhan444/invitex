import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const authCookie = request.cookies.get("inviteflix_admin_auth");

    // Check if the auth cookie exists and has valid value
    if (authCookie?.value !== "ryhan444_authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};

