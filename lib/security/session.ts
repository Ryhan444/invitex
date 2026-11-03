/**
 * Admin session & credential helpers.
 *
 * Uses only the Web Crypto API so the same code runs in the Edge middleware
 * and in Node route handlers. Nothing here may be imported by client code.
 */

export const SESSION_COOKIE = "__Host-ifx_s";
export const SESSION_COOKIE_DEV = "ifx_s"; // __Host- requires HTTPS; used on localhost only
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array<ArrayBuffer> {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Constant-time comparison to avoid timing side channels. */
export function safeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

/** Normalised secret admin base path, e.g. "/studio-7f3k9q". Null = admin disabled. */
export function getAdminBasePath(): string | null {
  const raw = (process.env.ADMIN_PATH || "").trim().replace(/^\/+|\/+$/g, "");
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(raw)) return null;
  if (raw.toLowerCase() === "admin") return null;
  return `/${raw}`;
}

export function isAdminConfigured(): boolean {
  return Boolean(
    getSessionSecret() &&
      getAdminBasePath() &&
      process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD_HASH
  );
}

async function hmac(data: string): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Session secret not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

/** Creates a signed token: base64url(payload).signature */
export async function createSessionToken(username: string): Promise<string> {
  const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(16)));
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        u: username,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
        n: nonce,
      })
    )
  );
  return `${payload}.${await hmac(payload)}`;
}

/** Returns the username if the token is authentic and not expired. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token || token.length > 1024 || !getSessionSecret()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  try {
    if (!safeEqual(await hmac(payload), signature)) return null;
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
    if (typeof data.u !== "string" || !safeEqual(data.u, process.env.ADMIN_USERNAME || "")) {
      return null;
    }
    return data.u;
  } catch {
    return null;
  }
}

/**
 * Verifies a password against ADMIN_PASSWORD_HASH.
 * Format: pbkdf2:<iterations>:<saltBase64Url>:<hashBase64Url> (no "$", which dotenv would expand)
 * Generate one with: npm run hash-password -- "<your password>"
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [scheme, iterStr, saltB64, hashB64] = stored.split(":");
  const iterations = Number(iterStr);
  if (scheme !== "pbkdf2" || !Number.isInteger(iterations) || iterations < 100_000 || !saltB64 || !hashB64) {
    return false;
  }

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64Url(saltB64), iterations },
    keyMaterial,
    256
  );
  return safeEqual(toBase64Url(bits), hashB64);
}

export function sessionCookieName(): string {
  return process.env.NODE_ENV === "production" ? SESSION_COOKIE : SESSION_COOKIE_DEV;
}
