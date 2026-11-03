# Inviteflix 🎬

**Inviteflix** is a digital invitation platform with a Netflix-inspired look (cinematic, dark mode, red accents). It is built on a block-based content engine, the Next.js App Router and Supabase (PostgreSQL + Realtime guestbook).

---

## Features

1. **Cinematic hero billboard (`/[slug]`)**
   - High-resolution poster and backdrop with Netflix-style gradients.
   - Confetti and background music when the guest presses **Open Invitation**.
   - Personalised guest name via query param: `/[slug]?to=John+Doe`.
2. **Story episodes:** your journey presented as a series of episodes.
3. **Schedule, countdown & maps:** live countdown, one-click Google Calendar, embedded map.
4. **Gallery:** photo gallery with a fullscreen lightbox.
5. **Digital gifts:** bank and e-wallet cards with one-tap copy, a QRIS preview and a gift delivery address.
6. **Live guestbook & RSVP:** wishes appear instantly through Supabase Realtime.
7. **Request form (`/request`):** clients submit their event details and choose sections.
8. **Admin studio:** a private dashboard to review requests, publish events and manage blocks.

---

## Tech stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti
- Supabase (PostgreSQL, Realtime)

---

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`. Without Supabase keys the app runs in in-memory demo mode.

### Admin studio credentials

The admin studio is served from a private URL segment set in `ADMIN_PATH` and stays disabled (404) until all four admin variables are set:

```bash
npm run hash-password -- "a-long-unique-password"
# prints ADMIN_PASSWORD_HASH=... and ADMIN_SESSION_SECRET=..., paste both into .env.local
```

```env
ADMIN_PATH=<random string, 8-64 chars>
ADMIN_USERNAME=<your username>
ADMIN_PASSWORD_HASH=<from the script>
ADMIN_SESSION_SECRET=<from the script>
```

Keep these values out of the repository and out of any public documentation.

### Database

Run `supabase/schema.sql` in the Supabase SQL editor. It creates the tables, RLS policies, the realtime publication for `guest_wishes`, and demo seed data.

### Run

```bash
npm run dev
```

---

## Public routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/reza-amanda-wedding` | Wedding demo |
| `/chapter-25-kevin` | Birthday demo |
| `/request` | Invitation request form |

---

## Security notes

- Admin sessions are HMAC-signed, `HttpOnly`, `Secure`, `SameSite=Strict` cookies that expire after 8 hours.
- Passwords are stored as PBKDF2-SHA256 hashes, never in source code.
- Admin pages and APIs return a plain 404 to unauthenticated visitors.
- Public endpoints validate input and are rate-limited per IP. The limiter is in-memory: on multi-instance or serverless hosting, back it with a shared store such as Upstash Redis.
- Security headers (CSP, HSTS, X-Frame-Options and more) are set in `next.config.ts`.

---

## Deploy

Deploy to Vercel or any Node host over **HTTPS**, and add every variable from `.env.example` in the host's environment settings.
