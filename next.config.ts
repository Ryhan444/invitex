import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; eval is only needed by the dev server.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https: data: blob:",
  "media-src 'self' https:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-src https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Never ship source maps to the browser in production.
  productionBrowserSourceMaps: false,
  images: {
    // HTTPS only — plain-http remote images are no longer proxied.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
