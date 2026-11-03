-- ====================================================================
-- INVITEFLIX: SUPABASE POSTGRESQL SCHEMA & REALTIME SETUP
-- Aesthetic: Netflix Cinematic Digital Invitation Engine
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL DEFAULT 'wedding', -- wedding, birthday, graduation, seminar, party
    event_date TIMESTAMPTZ NOT NULL,
    theme_config JSONB NOT NULL DEFAULT '{
        "primary_color": "#E50914",
        "bg_color": "#141414",
        "font_family": "Bebas Neue",
        "audio_url": "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
        "audio_title": "Cinematic Love Theme - Hans Zimmer Style",
        "match_rate": "99% Match",
        "maturity_rating": "ALL AGES",
        "season_badge": "Season 1: The Wedding",
        "trailer_preview_url": ""
    }'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for quick slug lookup
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON public.events(is_published);

-- 3. EVENT SECTIONS TABLE (Dynamic Blocks)
-- Types: banner, story, schedule, maps, gallery, donation, guestbook
CREATE TABLE IF NOT EXISTS public.event_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_event_sections_event_id ON public.event_sections(event_id);
CREATE INDEX IF NOT EXISTS idx_event_sections_order ON public.event_sections(event_id, order_index);

-- 4. GUEST WISHES & RSVP (Realtime enabled)
CREATE TABLE IF NOT EXISTS public.guest_wishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    attendance_status VARCHAR(50) NOT NULL DEFAULT 'attending', -- attending, not_attending, tentative
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_guest_wishes_event_id ON public.guest_wishes(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_wishes_created_at ON public.guest_wishes(created_at DESC);

-- 5. CREATION REQUESTS (Portal Pengajuan Tamu / Klien)
CREATE TABLE IF NOT EXISTS public.creation_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_creation_requests_status ON public.creation_requests(status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creation_requests ENABLE ROW LEVEL SECURITY;

-- Events Policies:
-- Anyone can view published events (or by slug query)
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

-- Authenticated admins can do anything
DROP POLICY IF EXISTS "Admins full access to events" ON public.events;
CREATE POLICY "Admins full access to events" ON public.events
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Event Sections Policies:
DROP POLICY IF EXISTS "Public can view sections of published events" ON public.event_sections;
CREATE POLICY "Public can view sections of published events" ON public.event_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE public.events.id = public.event_sections.event_id
            AND (public.events.is_published = true OR auth.role() = 'authenticated')
        )
    );

DROP POLICY IF EXISTS "Admins full access to sections" ON public.event_sections;
CREATE POLICY "Admins full access to sections" ON public.event_sections
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Guest Wishes Policies:
-- Public can read all wishes for an event
DROP POLICY IF EXISTS "Public can view guest wishes" ON public.guest_wishes;
CREATE POLICY "Public can view guest wishes" ON public.guest_wishes
    FOR SELECT USING (true);

-- Public can submit a wish
DROP POLICY IF EXISTS "Public can insert guest wishes" ON public.guest_wishes;
CREATE POLICY "Public can insert guest wishes" ON public.guest_wishes
    FOR INSERT WITH CHECK (true);

-- Authenticated admins can manage guest wishes
DROP POLICY IF EXISTS "Admins full access to guest wishes" ON public.guest_wishes;
CREATE POLICY "Admins full access to guest wishes" ON public.guest_wishes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Creation Requests Policies:
-- Public can submit creation requests
DROP POLICY IF EXISTS "Public can submit creation request" ON public.creation_requests;
CREATE POLICY "Public can submit creation request" ON public.creation_requests
    FOR INSERT WITH CHECK (true);

-- Authenticated admins can view and manage creation requests
DROP POLICY IF EXISTS "Admins full access to creation requests" ON public.creation_requests;
CREATE POLICY "Admins full access to creation requests" ON public.creation_requests
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- ENABLE SUPABASE REALTIME REPLICATION FOR GUESTBOOK
-- ====================================================================
BEGIN;
  -- Add guest_wishes table to supabase_realtime publication
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.guest_wishes;
COMMIT;

-- ====================================================================
-- SEED DATA: READY-TO-USE DEMO CINEMATIC INVITATIONS
-- ====================================================================

-- 1. DEMO EVENT 1: The Royal Wedding of Reza & Amanda
INSERT INTO public.events (
    id, slug, title, event_type, event_date, is_published, theme_config
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'reza-amanda-wedding',
    'Reza & Amanda: The Beginning of Forever',
    'wedding',
    '2026-12-25 10:00:00+07',
    true,
    '{
        "primary_color": "#E50914",
        "bg_color": "#141414",
        "font_family": "Bebas Neue",
        "audio_url": "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
        "audio_title": "A Thousand Years - Cinematic Orchestral Version",
        "match_rate": "99% Match for True Romance",
        "maturity_rating": "13+ LOVE",
        "season_badge": "Season 1 • Episode 1",
        "film_genre": "Romantic Drama • Real Life • Masterpiece",
        "trailer_preview_url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
    }'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- SECTIONS FOR DEMO EVENT 1
-- Banner Section
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'banner',
    0,
    true,
    '{
        "badge": "AN INVITEFLIX ORIGINAL WEDDING SPECIAL",
        "title": "REZA & AMANDA",
        "subtitle": "A lifelong saga directed by destiny, starring two souls destined for forever.",
        "backdrop_url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
        "poster_url": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        "groom_name": "Reza Rahardian",
        "groom_parents": "Putra dari Bpk. Ir. Hendra & Ibu Dr. Ratna",
        "bride_name": "Amanda Manopo",
        "bride_parents": "Putri dari Bpk. Drs. Bambang & Ibu Hj. Siti",
        "cta_text": "Buka Undangan (Play)",
        "rating": "99% Match",
        "year": "2026",
        "season": "Season 1",
        "tags": ["Heartfelt", "Cinematic Romance", "Grand Celebration"]
    }'::jsonb
);

-- Story Block (Episodes)
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'story',
    1,
    true,
    '{
        "heading": "EPISODES: HOW WE MET",
        "subheading": "Binge-watch our journey from college library to the wedding altar.",
        "episodes": [
            {
                "episode": "Episode 1",
                "title": "First Glance at the Coffee Shop",
                "duration": "2020",
                "synopsis": "Sebuah pertemuan tak terduga saat memesan Americano dingin di sudut Senopati. Secangkir kopi yang membuka ratusan percakapan tentang masa depan.",
                "thumbnail": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80"
            },
            {
                "episode": "Episode 2",
                "title": "Surviving the Long Distance",
                "duration": "2022",
                "synopsis": "Tantangan zona waktu terpisahkan jarak Jakarta - Tokyo. Ratusan jam video call membuktikan jarak tidak memudarkan komitmen.",
                "thumbnail": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
            },
            {
                "episode": "Episode 3",
                "title": "She Said YES on Mount Batur",
                "duration": "2025",
                "synopsis": "Di atas awan saat matahari terbit di Bali, Reza berlutut dan Amanda mengiyakan perjalanan seumur hidup.",
                "thumbnail": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80"
            }
        ]
    }'::jsonb
);

-- Schedule & Maps Block
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'schedule',
    2,
    true,
    '{
        "heading": "PREMIERE SCHEDULE & VENUE",
        "subheading": "Jangan lewatkan waktu penayangan momen sakral kami.",
        "events": [
            {
                "title": "Akad Nikah (Holy Matrimony)",
                "date": "Jumat, 25 Desember 2026",
                "time": "08:00 - 10:00 WIB",
                "location_name": "Grand Ballroom Hotel Indonesia Kempinski",
                "address": "Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat",
                "notes": "Khusus Keluarga dan Kerabat Terdekat",
                "icon": "ring"
            },
            {
                "title": "Grand Gala Reception",
                "date": "Jumat, 25 Desember 2026",
                "time": "18:30 - 21:30 WIB",
                "location_name": "Grand Ballroom Hotel Indonesia Kempinski",
                "address": "Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat",
                "notes": "Dress Code: Black Tie / Glamorous Red & Black",
                "icon": "party"
            }
        ],
        "maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322384!2d106.8195613!3d-6.1947413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f421f153a83f%3A0xb35a09c25f4a7c1b!2sHotel%20Indonesia%20Kempinski%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid",
        "google_maps_url": "https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta"
    }'::jsonb
);

-- Gallery Block
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'gallery',
    3,
    true,
    '{
        "heading": "BEHIND THE SCENES & TRAILERS",
        "subheading": "Potret romansa kami dalam resolusi 4K Ultra HD.",
        "photos": [
            {
                "title": "Sunset in Sumba",
                "url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
                "tag": "Pre-Wedding #1"
            },
            {
                "title": "Laughter & Moments",
                "url": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
                "tag": "Pre-Wedding #2"
            },
            {
                "title": "Elegance in Red",
                "url": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
                "tag": "Editorial"
            },
            {
                "title": "Promise of Forever",
                "url": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
                "tag": "Golden Hour"
            },
            {
                "title": "Under the Starlight",
                "url": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
                "tag": "Night Portrait"
            }
        ]
    }'::jsonb
);

-- Digital Gift & Donate Block
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'donation',
    4,
    true,
    '{
        "heading": "BOX OFFICE CONTRIBUTION (DIGITAL GIFT)",
        "subheading": "Doa restu Anda adalah anugerah terbesar bagi kami. Jika ingin memberikan tanda kasih secara digital:",
        "accounts": [
            {
                "bank_name": "Bank Central Asia (BCA)",
                "account_number": "8830192847",
                "account_holder": "Reza Rahardian",
                "logo": "bca"
            },
            {
                "bank_name": "Bank Mandiri",
                "account_number": "1370019284732",
                "account_holder": "Amanda Manopo",
                "logo": "mandiri"
            }
        ],
        "qris_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80",
        "gift_address": "Penerima: Reza & Amanda (Villa Senopati Indah No. 42, Kebayoran Baru, Jakarta Selatan 12190)"
    }'::jsonb
);

-- Guestbook Block
INSERT INTO public.event_sections (event_id, type, order_index, is_visible, content)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'guestbook',
    5,
    true,
    '{
        "heading": "AUDIENCE REVIEWS & WISHES",
        "subheading": "Tinggalkan ulasan, doa restu, dan konfirmasi kehadiran Anda secara live.",
        "rsvp_enabled": true
    }'::jsonb
);

-- DEMO GUEST WISHES
INSERT INTO public.guest_wishes (event_id, name, attendance_status, message)
VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Nicholas Saputra',
    'attending',
    'Selamat buat Reza & Amanda! Produksi romansa terbaik tahun ini. Pasti hadir di premiere malam nanti! 🍿🍾'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Chelsea Islan',
    'attending',
    'Happy wedding kalian berdua! Langgeng terus sampai kakek nenek, visual undangannya keren banget gila ala Netflix! ❤️✨'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Raditya Dika',
    'tentative',
    '10/10 Rotten Tomatoes rating! Semoga pernikahannya seasyik nonton film box office setiap hari. Jangan lupa sediain popcorn di resepsi ya!'
);

