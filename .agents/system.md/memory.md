# memory.md — Handoff untuk Agent Berikutnya · Konsera Frontend

> Ditulis 24 Nov 2026 di akhir fase **frontend murni (data dummy)**. Fase berikutnya: **consume API backend**.
> Baca file ini **pertama**, lalu `backend-alignment.md` (kontrak backend asli + gap), `rules.md`, `prd.md`, `design.md` di folder yang sama. `openapi-spec.yaml` sudah **usang**: kontrak yang berlaku adalah backend di `../konsera-backend`.
> Bila file ini bertentangan dengan `rules.md`, ikuti bagian **"Keputusan user"** di sini (itu instruksi langsung dari pemilik proyek), lalu tanyakan sisanya ke user.

---

## 1. Ringkasan singkat

- **Konsera**: aplikasi tiket konser (proyek UKK XII RPL). Repo ini = **frontend web saja** (`konsera-frontend`), bukan monorepo seperti yang digambarkan `rules.md` §2.
- Semua layar untuk 4 role sudah dibangun dengan **data dummy** (`src/__fixtures__/`): **user/fan**, **organizer**, **gatekeeper**, **admin**.
- Belum ada satu pun panggilan API. Tidak ada TanStack Query, Zustand, React Hook Form, atau api-client.
- Tugas berikutnya: mengganti fixture dan "demo cookie" dengan API sungguhan, tanpa mengubah tampilan yang sudah disetujui user.
- Commit terakhir di `main`: `36346bc` (sudah di-push ke `github.com/Kyuusan/Konseraa-fe`).

## 2. Stack aktual (berbeda dari `rules.md`)

| Hal | Aktual di repo | `rules.md` bilang |
|---|---|---|
| Framework | **Next.js 16.3.1** App Router + Turbopack, React 19.2, **React Compiler aktif** | Next 14 |
| CSS | **Tailwind v4** (`@theme inline` di `src/app/globals.css`, `@custom-variant dark (&)`) | Tailwind 3 |
| Struktur | Satu app, `src/` (lihat §4) | Monorepo `apps/web` + `packages/*` |
| Validasi | **Zod v4** di `src/types/*`, tipe via `z.infer` | sama (tapi di `@konsera/shared-types`) |
| UI | **shadcn** (`components.json` manual, style new-york) + **Animate UI** (`@animate-ui/components-*`, di atas `motion/react`) | shadcn |
| Chart | `recharts` 3.8 lewat shadcn `ui/chart.tsx` | — |
| QR | `react-qr-code` (e-ticket), `html5-qrcode` (scanner gate) | sama |
| Data fetching | **belum ada** | TanStack Query + api-client |

- `AGENTS.md` mengingatkan: ini **bukan Next.js yang kamu kenal**. Baca `node_modules/next/dist/docs/` sebelum memakai API Next yang baru (mis. `params`/`searchParams` adalah **Promise**).
- Dependency yang disetujui `rules.md` §3.1 (TanStack Query, Zustand, React Hook Form, `@hookform/resolvers`) **belum terpasang**. User minta: install hanya yang memang diperlukan, dan **tanya dulu** sebelum menambah dependency.

## 3. Keputusan & preferensi user (WAJIB dipatuhi)

### 3.1 Cara kerja
- Balas user dalam **Bahasa Indonesia**. Teks UI aplikasi dalam **Bahasa Inggris**.
- **Jangan tambah fitur/halaman/layer yang tidak diminta.** User beberapa kali menolak "mock API layer", "session layer" dan file yang belum perlu.
- **Aturan bisnis yang ambigu: tanya user dulu** (`rules.md` §1.5). Sertakan usulan default.
- **User yang menguji di browser.** Jangan menjalankan Playwright/screenshot tanpa diminta. Cukup `tsc`, `eslint`, `next build`, dan smoke test `curl`.
- **Commit & push hanya bila diminta**, dipecah **per halaman/fitur**, Conventional Commits dengan scope modul (`auth`, `event`, `booking`, `payment`, `ticket`, `checkin`, `notif`, `review`, `admin`, `organizer`, `ui`, `shared`). Push langsung ke `main` sudah biasa dilakukan atas izin user.
- **Jangan pernah commit folder `playground/`** (milik user, untracked).
- `src/app/gate/page.tsx` punya perubahan spasi di akhir file yang **bukan** buatan agent. Biarkan, atau tanya user.
- Jangan mengubah `src/components/layout/navbar.tsx` (navbar **landing page**) dan halaman landing (`src/app/page.tsx`, `components/sections`, `components/landingPage`) kecuali diminta.

### 3.2 UI
- Pakai komponen **shadcn / Animate UI**, **bukan** elemen HTML native (select, checkbox, radio, date, dialog, dropdown, tabs, switch, accordion, sheet, popover, progress, tooltip).
- Semua tabel **wajib** memakai `src/components/ui/tableBase.tsx` (komponen dari user; header berbeda warna + zebra stripe). Bungkus kartu tabel: `overflow-hidden rounded-[20px] bg-bg-surface`.
- Hindari **"AI slop"**: tanpa gradient, glow, atau ikon dekoratif yang tidak perlu. Ikon hanya dari `lucide-react`.
- Warna & font hanya dari token Stagelight (`design.md`, `globals.css`). Gelap, accent **lime `#C6FF3D`** dan **pink `#FF3DA6`**. Token status tambahan yang disetujui: `--color-danger`, `--color-warning`.
  - Font: Manrope (body), `font-heading` (Outfit, pengganti Author), `font-logo` (Ethnocentric, hanya logo).
- Teks harus **kontras**: pakai `text-text-primary` atau `text-text-primary/70`. Hindari `text-text-muted` untuk teks penting.
- Item aktif di headbar berwarna **pink**. Item aktif di sidebar/chip berwarna **lime**.
- Komponen dipecah per role: `userComponent`, `organizerComponent`, `gateComponent`, `adminComponent`. Komponen bersama akun ada di `accountComponent`. Layout ada di `components/layout`.
- Mata uang **Rupiah (IDR)** (keputusan user 24 Nov 2026; `formatPrice` masih USD dan perlu diganti). Waktu ditampilkan dalam **zona waktu venue**.

### 3.3 Jebakan teknis yang sudah diketahui
- **Shadcn CLI** sering menulis `import { cn } from "cn"` dan memasang paket npm `cn`. Setelah `shadcn add`, ganti import ke `@/lib/utils` lalu jalankan `npm uninstall cn`.
- **Jangan** pakai `<Button asChild>` di Server Component (crash "displayName"). Pakai `ButtonLink` (`userComponent/shared/buttonLink.tsx`).
- Server Component **tidak boleh** mengimpor **konstanta** dari file `"use client"`. Pindahkan ke modul biasa (contoh: `ticketSections.ts`, `events/statusFilters.ts`).
- Waktu/clock di client: `useNow` / `useRemaining` (`src/hooks/use-now.ts`, server snapshot `null`), supaya tidak terjadi hydration mismatch.
- **React Compiler lint**: jangan panggil `Date.now()` atau `new Date()` langsung di render komponen. Taruh di event handler, fixture, atau helper (`currentYear()` di `lib/format.ts`).
- File vendor Animate UI dikecualikan dari beberapa aturan lint di `eslint.config.mjs`.
- **FE tidak menghitung uang** (total, fee, diskon, komisi). Angka datang dari "backend" (fixture). Pertahankan prinsip ini saat consume API.

## 4. Struktur folder

```
src/
  app/
    (auth)/            login, register, verify-otp, forgot-password, reset-password (+ *Page.tsx, authUi.tsx)
    (onboarding)/      profiling (stepper domisili + genre/artis)
    (main)/            area user + organizer (headbar user; gatekeeper di-redirect ke /gate)
      home, events, events/[slug], events/[slug]/tickets, checkout, payment/[bookingCode](/success),
      tickets, tickets/[id], orders, orders/[bookingCode]/refund, saved, profile, notifications,
      organizer/ (layout + sidebar), organizer/{apply,events,events/new,events/[slug],promos,promos/new,
      promos/[id]/edit,refunds,gatekeepers,analytics,payouts,help}
    gate/              layout sendiri: /gate (scan), /gate/stats, /gate/profile, /gate/notifications
    admin/login        UI saja
    admin/(panel)/     dashboard, verifications, events, reviews, users, transactions, profile, notifications
  __fixtures__/        SEMUA data dummy (ganti dengan API; lihat §6)
  types/               Zod schema + tipe (event, booking, ticket, organizer, admin, promo, payout, analytics,
                       gatekeeper, notification, refund, eventForm, auth, user)
  lib/                 constants.ts (aturan bisnis), format.ts (formatter), utils.ts (cn)
  hooks/               use-now, use-online, use-favorites
  components/
    ui/                shadcn (tableBase, chart, select, calendar, input, textarea, badge, label, input-otp)
    animate-ui/        vendor Animate UI (button, dialog, sheet, tabs, switch, accordion, dropdown, popover, …)
    layout/            headbar (user/admin), sidebar (organizer/admin), shared/navigation.ts
    userComponent/ organizerComponent/ gateComponent/ adminComponent/ accountComponent/
```

## 5. Progres per role (semua dengan data dummy)

**User / fan**
- **Auth:** login (dengan pengalihan per role untuk demo), register dengan OTP, lupa password, dan reset password.
- **Profiling:** stepper domisili dan genre/artis favorit.
- **Home:** beranda bergaya e-commerce.
- **Explore:** pencarian dan filter (kota, tanggal, genre, harga).
- **Detail event:**
  - Tab Description, Line-up, dan Reviews.
  - Review dengan foto. Event yang belum berlangsung menampilkan review dari edisi sebelumnya.
  - Peta venue (seat map) dan tombol simpan (favorit).
- **Pilih tiket:** denah inline berdampingan dengan daftar tier, maksimal 6 tiket.
- **Checkout:** kode promo, pilihan metode bayar, countdown hold.
- **Pembayaran:**
  - Instruksi VA atau QRIS dan polling status setiap 5 detik.
  - Pesanan yang belum dibayar kedaluwarsa otomatis setelah **1 jam**.
  - Bisa dibatalkan.
- **Halaman sukses pembayaran.**
- **My tickets:** e-ticket dengan QR dinamis setiap 30 detik dan watermark. Transfer tiket terkunci H-1. Ada tombol "Rate this show".
- **My orders:** filter status, lanjutkan pembayaran, batalkan, dan ajukan refund.
- **Halaman Saved.**
- **Profile:** detail, personal info opsional, genre favorit, password, dan preferensi notifikasi.
- **Notification center.**

**Organizer** (satu akun dengan user; menu Organizer tampil untuk semua)
- **Onboarding:**
  - Intro, form pengajuan sesuai model backend, dan status pengajuan.
  - Cookie demo + `DemoStateSwitcher` (khusus dev) untuk berpindah status none/pending/in_review/rejected/approved.
- **Dashboard:** KPI, grafik garis penjualan, status event, next show, needs attention, dan recent sales.
- **My events:** tab per status.
- **Wizard Create event (5 step):**
  - Basics.
  - Venue dengan izin keramaian dan editor **area** (`venue_sections` + kursi).
  - Sessions.
  - Tickets, setiap tier memilih areanya.
  - Review.
  - Draft dan event yang ditolak bisa dibuka lagi.
- **Detail event:** setelah publish hanya banner dan deskripsi yang bisa diedit. Event yang ditolak punya tombol "Fix & resubmit".
- **Promo codes:** create, edit (hanya yang belum terpakai), batas diskon, on/off, dan hapus (hanya yang belum terpakai).
- **Refunds:** approve atau reject dengan filter event, sesi, alasan, dan pencarian.
- **Gatekeepers:** buat akun dengan password terlihat, reset password, on/off, dan hapus.
- **Analytics:** penjualan harian, per tier, dan peta panas kedatangan.
- **Payouts.**
- **Help** (FAQ).

**Gatekeeper**
- Login lewat `/login` dengan email gatekeeper fixture. Akses dibatasi ke `/gate`.
- **Scanner:** kamera dan input manual, feedback warna, suara, dan getaran, aturan jam gerbang, antrean offline, dan panel dev.
- Statistik pengunjung, profil (ganti password sementara), dan notifikasi.

**Admin**
- **Dashboard:** KPI, grafik GMV, antrean review, payout due, dan transaksi.
- **Verifications:** KYC organizer, approve atau reject dengan alasan.
- **Events:** review event beserta izin keramaian, approve (langsung publish) atau reject.
- **Reviews:** moderasi, hide atau restore.
- **Users:** filter, suspend, ban, verify, dan pagination 10 per halaman.
- **Transactions:** transaksi, refund force majeure, payout (jadwalkan H+3), dan ringkasan komisi.
- Profil dan notifikasi.

**Kualitas:** `npx tsc --noEmit`, `npx eslint src`, dan `npx next build` semuanya bersih per commit `36346bc`.

## 6. Lapisan dummy yang HARUS diganti saat consume API

### 6.1 Fixture → endpoint
Base URL backend asli: `http://localhost:8080` (tanpa `/api/v1`), auth header Bearer JWT 15 menit. Kolom "Endpoint di spec" di bawah mengikuti `openapi-spec.yaml` yang usang; path asli ada di `backend-alignment.md` §3.

| Fixture (`src/__fixtures__/`) | Dipakai untuk | Endpoint di spec | Catatan |
|---|---|---|---|
| `events.ts` | katalog, detail, sesi, tier, featured | `GET /events`, `/events/{id}`, `/events/{id}/sessions`, `/events/{id}/ticket-tiers`, `/events/featured`, `/events/search` | detail pakai **slug** di URL; spec pakai `id` → tanya BE apakah ada lookup by slug |
| `venueLayouts.ts` | peta venue | `GET /events/{id}/seat-map` (schema kosong di spec) | model BE: `venue_sections` + `seats` |
| `checkout.ts` | hold, preview booking, payment | `POST /carts`, `POST /bookings`, `POST /bookings/{id}/pay`, `GET /bookings/{id}/payment-status` | state checkout dibawa lewat **URL** (`checkout/checkoutParams.ts`); ganti dengan cart di server |
| `orders.ts` | riwayat pesanan, kelayakan refund | `GET /users/me/bookings`, `POST /bookings/{id}/cancel` | kelayakan refund dihitung fixture (seharusnya BE) |
| `tickets.ts` | tiket saya, QR | `GET /users/me/tickets`, `/tickets/{id}`, `/tickets/{id}/qr-code`, `POST /tickets/{id}/transfer` | token QR fixture = `KONSERA:<code>` |
| `reviews.ts` | review + moderasi | — (tidak ada di spec) | model BE `reviews` ada (status, photo_urls) |
| `session.ts`, `demoState.ts` | sesi, organizer saat ini, favorit | `GET /users/me`, `/users/me/preferences`, `POST /auth/login` … | lihat 6.2 |
| `organizerEvents.ts`, `promos.ts`, `refundRequests.ts`, `payouts.ts`, `analytics.ts`, `gatekeepers.ts` | area organizer | — (tidak ada di spec) | perlu endpoint dari BE |
| `checkIns.ts` | scan, statistik, log | `POST /check-ins`, `GET /check-ins/stats/{event_id}`, `/check-ins/logs/{event_id}` | response belum punya schema |
| `notifications.ts` | notifikasi semua role | — | model BE `notifications` (read_at, channel, metadata) |
| `admin.ts`, `adminReviews.ts`, `adminUsers.ts`, `adminFinance.ts` | area admin | `GET /admin/users`, `PUT /admin/users/{id}/status`, `GET /admin/events/pending`, `PUT /admin/events/{id}/approve`, `GET /admin/financials`, `POST /admin/payouts` | verifikasi organizer, review, refund admin: tidak ada di spec |
| `ids.ts` | `fixtureId()`, `unsplash()` | — | hapus bila fixture sudah tidak dipakai |

Saat sebuah fixture diganti, **hapus** fixture itu. Jangan biarkan dua sumber data hidup bersamaan. Sesuai `rules.md` §16 no. 11, tidak boleh ada mock atau stub di kode produksi.

### 6.2 Demo cookie & panel dev (hapus/ganti dengan sesi asli)
- Cookie: `konsera-demo-organizer` (status organizer), `konsera-demo-application` (ringkasan form), `konsera-demo-gatekeeper` (login gatekeeper), `konsera-demo-favorites` (event tersimpan).
- **Login demo** (`app/(auth)/loginPage.tsx`): email gatekeeper fixture membuka `/gate`, email lain membuka `/home`. Diganti dengan `POST /auth/login`. Sesi membaca `roles` + `organizer_id` (`SessionSchema` di `types/user.ts`). Token **httpOnly cookie**, bukan localStorage (`rules.md` §8.4).
- Panel/tombol **khusus development** yang harus hilang setelah API siap:
  - `DemoStateSwitcher` (organizer).
  - Panel "Ignore gate hours" + kode contoh (gate).
  - "Simulate payment received" (pembayaran).
  - Link "open the link from the email" (lupa password).
- Admin **belum punya sesi**: `/admin/login` hanya UI.
- Guard yang perlu diganti dengan cek role dari sesi asli:
  - `requireApprovedOrganizer` (`organizerComponent/`).
  - `requireGatekeeper` (`gateComponent/`).
  - Redirect gatekeeper di `app/(main)/layout.tsx`.

### 6.3 Aksi yang saat ini hanya state lokal (hilang saat reload)
- **Profil & preferensi:** simpan profil, personal info, genre favorit, password, dan preferensi notifikasi.
- **Event & tiket:** submit wizard, edit banner/deskripsi, transfer tiket, kirim review, dan batal pesanan.
- **Promo, refund & gatekeeper:** semua aksi promo, pengajuan dan keputusan refund, serta semua aksi gatekeeper.
- **Admin:** keputusan review event dan verifikasi, hide/restore review, status user, refund force majeure, dan jadwal payout.

Semua ini perlu mutation API dan invalidasi query.

## 7. Keputusan bisnis yang SUDAH disepakati user

**Organizer & event**
- **Verifikasi dua level:** KYC organizer sekali, lalu **izin keramaian per event**. Create event baru terbuka setelah organizer disetujui.
- **Event yang di-approve admin langsung publish.** Setelah publish, hanya banner dan deskripsi yang bisa diedit.
- **Data organizer** hanya yang ada di model BE: `company_name`, `legal_entity_type`, dokumen (`organizer_verifications`, satu baris per dokumen: KTP, NIB opsional).
  - Penanggung jawab = **pemilik akun** (`organizers.user_id`).
  - Kota, alamat, dan NIK **sudah dihapus** dari form.

**Seat map**
- Digambar dari `venue_sections` + `seats` (+ `ticket_tiers.venue_section_id`, `is_seated`). **Tidak ada upload gambar denah.**
- Urutan area dianggap urutan dari depan panggung.
- Kursi **belum bisa dipilih** (ditunda).

**Promo**
- Dibuat oleh organizer, berupa persentase (dengan `max_discount_amount` opsional) atau nominal tetap.
- Promo yang **sudah dipakai** tidak bisa diedit atau dihapus, hanya dimatikan.

**Gatekeeper**
- Akun dibuat organizer dengan password **terlihat** (dibagikan manual). Sarannya: wajib ganti password saat login pertama.
- Akses hanya scan dan statistik. Ditugaskan per event.
- Login lewat `/login` yang sama dengan user.
- Gerbang buka 2 jam sebelum acara dan tutup 1 jam setelah acara mulai. Satu kali scan per tiket.

**Pembayaran & pesanan**
- Pesanan yang tidak dibayar **1 jam** (semua metode) otomatis menjadi **`expired`**. Ini menggantikan 24 jam/15 menit di PRD §9.2.
- **Transfer tiket:** langsung berlaku, tanpa langkah "terima", tidak bisa dibatalkan, terkunci H-1.

**Refund**
- Penuh (termasuk fee) dan per pesanan. Yang memutuskan **organizer**. Tutup **7 hari** sebelum acara (zona waktu venue).
- Pesanan dengan tiket yang sudah ditransfer **tidak bisa** di-refund.
- Admin bisa refund **force majeure** dengan alasan wajib, melewati aturan 7 hari.

**Komunitas & akun**
- **Review:** hanya penonton yang sudah check-in, setelah event selesai, maksimal 3 foto.
  - Event yang belum berlangsung menampilkan review edisi sebelumnya.
  - Moderasi oleh **admin** (`status` published/hidden).
- **Favorit** = `favorites { user_id, event_id }`, dengan halaman `/saved`.
- **Zona waktu:** asumsi FE memakai IANA timezone per venue.

**Navigasi**
- Menu **Settings** dihapus dari semua sidebar dan menu profil.
- Menu "Create event" tidak ada di sidebar organizer (aksesnya dari tombol).

## 8. Kekurangan spec & model backend (catat, jangan diam-diam diisi sendiri)

### 8.1 Model Go backend
Backend lengkap ada di folder sibling `../konsera-backend` (models, DTO, handler, migrasi = schema SQL). Backend **dipegang orang lain** dan **tidak boleh disentuh sama sekali** (kode, `.env`, migrasi, konfigurasi, termasuk menjalankannya untuk mengubah sesuatu). Backend hanya dibaca sebagai referensi kontrak. Kebutuhan dicatat sebagai permintaan ke tim backend. Analisis lengkap gap FE ↔ BE ada di **`backend-alignment.md`**; isi §8.1–8.2 di bawah ini sebagian sudah digantikan file itu.

Yang dikonfirmasi model tapi tidak ada di OpenAPI: `favorites`, `reviews` (status, photo_urls, booking_id), `refunds`, rekening bank organizer, `events.banner_url`, `event_sessions.gate_open_at/gate_close_at`, `ticket_transfers.status`, `user_profiles`, `user_preferences.marketing_opt_in`, `audit_logs`, `commission_settings`, `payouts.bank_reference`, `promo_codes.max_discount_amount`.

### 8.2 Belum ada di spec maupun model
Rekomendasikan ke BE:
- **Venue & event:**
  - `venues.timezone`.
  - Lookup event by slug.
- **Gatekeeper:**
  - Tabel `event_gatekeepers (event_id, user_id, assigned_by)`.
  - Tautan gatekeeper ke organizer.
  - Validasi penugasan di `POST /check-ins`.
- **Tiket & refund:**
  - Status tiket `on_hold` selama refund diproses.
  - Kolom alasan penolakan refund.
- **Endpoint yang belum ada:**
  - Semua endpoint area organizer: events CRUD dan submit, promos, refunds, gatekeepers, analytics, payouts.
  - Verifikasi organizer dan upload dokumen.
  - Moderasi review.
  - Notifikasi: list dan mark read.
  - Ganti password user yang login.
  - Q&A/forum dan laporan konten.
  - Invoice PDF.
- **Schema response** untuk: `/events/{id}/seat-map`, `/check-ins*`, `/admin/*`, `/users/me/bookings` (butuh data event, sesi, dan metode bayar).
- **Pembayaran:** data instruksi (nomor VA, QRIS) akan datang dari **payment gateway** di backend.
- **Model backend:** `Venue` tidak punya timezone. Event memakai `category_ids` dan tabel `event_categories` (FE masih memakai array string `categories`). Kuota ada di `ticket_inventories` per tier per sesi (FE memakai `available_quota`).

### 8.3 Penanda di kode
Field FE yang tidak ada di spec ditandai komentar **"Not in spec"** di `src/types/*`. Gunakan penanda ini sebagai daftar periksa saat menyelaraskan dengan API.

## 9. DILARANG

1. Mengubah tampilan atau UX yang sudah disetujui saat "hanya" mengganti sumber data.
2. Membuat endpoint, field, atau aturan bisnis karangan sendiri. Kalau API belum ada, **tanya user**, jangan buat mock layer baru.
3. Menghitung harga, fee, diskon, komisi, atau kelayakan refund di FE. Semuanya dari BE.
4. `fetch()` langsung di komponen; data server di Zustand; token di `localStorage`; `dangerouslySetInnerHTML` untuk konten user.
5. Elemen form HTML native bila ada versi shadcn/Animate UI; tabel tanpa `tableBase`; ikon selain lucide; warna atau hex di luar token.
6. `<Button asChild>` di Server Component; mengimpor konstanta dari file `"use client"` ke Server Component.
7. Commit tanpa diminta, commit `playground/`, menyentuh navbar landing.
8. Menambah dependency tanpa izin user.
9. `any`, `as` pada data network, `@ts-ignore`, `enum` (pakai Zod enum / `as const`).

## 10. Yang HARUS dilakukan berikutnya (usulan urutan)

1. **Konfirmasi ke user dulu:**
   - Base URL dan env (`NEXT_PUBLIC_API_URL`?).
   - Mekanisme auth (httpOnly cookie via route handler BFF di `app/api`?).
   - Izin memasang TanStack Query (+ React Hook Form bila perlu).
   - Model Go terbaru dan schema SQL.
2. **Buat lapisan API** sesuai `rules.md` §8.2:
   - Satu modul client (fetch wrapper + parsing response dengan Zod `ApiResponse`).
   - Query key factory.
   - Hooks per domain.
   - Semua response di-`safeParse` dengan schema di `src/types/*`. Perbarui schema bila kontrak BE berbeda, lalu hapus penanda "Not in spec" yang sudah terpenuhi.
3. **Auth dulu:** login, register, OTP, refresh, logout, sesi (`roles`, `organizer_id`). Ganti guard dan login demo (§6.2).
4. **Alur pembeli:** events, tiers, sessions, cart (ganti URL-state checkout), booking, pay, payment-status (polling yang sudah ada), tickets, QR, transfer, bookings (orders), cancel.
5. **Check-in gate:** `POST /check-ins`, stats, logs. Antrean offline tetap di client.
6. **Admin** sesuai endpoint di spec. Sisanya (organizer, verifikasi, review, notifikasi, refund) menunggu endpoint dari BE.
7. **Setelah setiap domain tersambung:** hapus fixture dan panel dev terkait, lalu jalankan `npx tsc --noEmit`, `npx eslint src`, dan `npx next build`. Laporkan ke user dan biarkan user menguji di browser.
