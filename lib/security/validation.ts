/** Input validation helpers shared by API routes. */

export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "graduation",
  "seminar",
  "party",
  "anniversary",
] as const;

export const ATTENDANCE_STATUSES = ["attending", "not_attending", "tentative"] as const;

export const SECTION_TYPES = [
  "banner",
  "story",
  "schedule",
  "maps",
  "gallery",
  "donation",
  "guestbook",
] as const;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s-]{8,20}$/;

/** Trims, strips control characters and enforces a max length. */
export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

export function isValidEmail(value: string) {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}

export function isValidPhone(value: string) {
  return PHONE_PATTERN.test(value);
}

export function isValidSlug(value: string) {
  return value.length >= 3 && value.length <= 80 && SLUG_PATTERN.test(value);
}

/** Only allow absolute https URLs (blocks javascript:, data:, etc.). */
export function cleanHttpsUrl(value: unknown, maxLength = 2048): string {
  const text = cleanText(value, maxLength);
  if (!text) return "";
  try {
    const url = new URL(text);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function isOneOf<T extends readonly string[]>(list: T, value: unknown): value is T[number] {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

export function isValidDate(value: unknown): value is string {
  return typeof value === "string" && value.length <= 40 && !Number.isNaN(Date.parse(value));
}
