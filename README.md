# Inviteflix 🎬🍿

**Inviteflix** adalah platform web undangan digital serbaguna dengan estetika visual ala **Netflix** (Cinematic, Modern Dark Mode, dan Red Accents). Dirancang dengan arsitektur **block-based dynamic engine**, performa tinggi Next.js App Router, dan PostgreSQL di Supabase dengan Realtime Guestbook.

---

## 🌟 Fitur Utama

1. **Cinematic Hero Billboard (`/[slug]`)**
   - Poster & backdrop resolusi tinggi dengan gradien khas Netflix.
   - Efek perayaan konfeti dan pemutar musik instan saat tombol **"Buka Undangan (Play)"** ditekan.
   - Personalisasi nama tamu VIP via URL query param: `/[slug]?to=Bpk.+Joko+Widodo`.

2. **Episodes / Story Timeline Block**
   - Kisah perjalanan disajikan dalam format episode serial Netflix lengkap dengan thumbnail, durasi tahun, dan sinopsis.

3. **Premiere Schedule, Countdown & Maps**
   - Hitung mundur live (Hari, Jam, Menit, Detik).
   - Integrasi tombol satu klik **+ Google Calendar**.
   - Peta lokasi interaktif dark-mode Google Maps dan navigasi aplikasi.

4. **Behind the Scenes Gallery**
   - Galeri foto 4K dengan modal Lightbox viewer (Next, Previous, Fullscreen).

5. **Box Office Contribution (Digital Gift)**
   - Kartu bank & e-wallet dengan tombol **Salin Nomor Rekening** instan.
   - Preview scan barcode **QRIS**.
   - Alamat pengiriman kado fisik dengan tombol salin alamat.

6. **Live Audience Reviews (Realtime Guestbook & RSVP)**
   - Tamu dapat mengirimkan ucapan dan status kehadiran (Hadir, Ragu-ragu, Berhalangan).
   - Feed ucapan terhubung dengan **Supabase Realtime Channel** (muncul seketika tanpa refresh halaman).

7. **User Request Portal (`/request`)**
   - Formulir permohonan bagi klien umum untuk memesan undangan kustom.
   - Pilihan checklist blok komponen dinamis yang diinginkan.
   - Status permohonan tersimpan di database (`PENDING`, `APPROVED`, `REJECTED`).

8. **Admin Studio Dashboard (`/admin`)**
   - Login admin dengan passkey atau Supabase Auth (tersedia tombol 1-Click Demo Studio Login).
   - Metrik ringkasan (Total Undangan, Published, Pending Request).
   - Verifikasi Request: 1-click **Approve & Generate** langsung membuat halaman `/[slug]` aktif, atau hubungi via WhatsApp.
   - **Visual Block Manager**: Atur urutan blok (Re-order Up/Down), toggle visibility (Show/Hide), dan edit data JSON langsung.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components & Server Actions)
- **Language:** TypeScript
- **Styling & Animation:** Tailwind CSS, Framer Motion, Lucide Icons, Canvas Confetti
- **Database & Realtime:** Supabase (PostgreSQL & Realtime Publication)
- **Deployment:** Vercel & Supabase

---

## 🚀 Panduan Setup Lokal

### 1. Clone & Install Dependensi
```bash
git clone <repo-url>
cd invitex
npm install
```

### 2. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_SECRET_KEY=admin123
```

> **Catatan:** Jika belum memasukkan key Supabase, Inviteflix secara otomatis berjalan dalam mode **Demo In-Memory Mode** dengan data undangan Reza & Amanda dan Kevin Sanjaya siap uji coba tanpa error.

### 3. Migrasi Skema Supabase PostgreSQL
Buka **SQL Editor** di Dashboard Supabase Anda, lalu salin dan jalankan seluruh isi berkas:
[`supabase/schema.sql`](file:///Users/mac/Documents/invitex/supabase/schema.sql)

Skema ini sudah mencakup:
- Ekstensi `uuid-ossp`
- Tabel `events`, `event_sections`, `guest_wishes`, `creation_requests`
- Row Level Security (RLS) Policies
- Realtime publication `supabase_realtime` untuk tabel `guest_wishes`
- Seed data demo undangan pernikahan dan pesta ulang tahun

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🌐 Rute Halaman

| Rute | Deskripsi |
|---|---|
| `/` | Landing page publik Inviteflix bergaya Netflix Billboard |
| `/reza-amanda-wedding` | Demo undangan pernikahan sinematik |
| `/chapter-25-kevin` | Demo undangan pesta ulang tahun / VIP event |
| `/request` | Formulir pengajuan pembuatan undangan oleh publik |
| `/admin/login` | Halaman login admin studio |
| `/admin/dashboard` | Dashboard manajemen acara & metrik |
| `/admin/dashboard/requests` | Panel verifikasi dan persetujuan pengajuan |
| `/admin/dashboard/events/create` | Manual event creator |
| `/admin/dashboard/events/[id]/edit` | Visual block re-ordering & JSON editor |

---

## ☁️ Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Import Project**.
3. Tambahkan Environment Variables dari `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Klik **Deploy**!

