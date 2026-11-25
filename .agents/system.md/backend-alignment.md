# backend-alignment.md — Kesesuaian Frontend ↔ Backend Konsera

> Ditulis 24 Nov 2026 dari pembacaan seluruh `konsera-backend/` (migrasi, models, DTO, handler, service, repository) dan `konsera-frontend/src/types/*`.
> Backend **bukan dipegang pemilik repo frontend**. Jangan mengubah kode backend. Temuan di sini adalah bahan permintaan ke tim backend.
> Kontrak yang berlaku adalah backend asli (`konsera-backend/internal/server/routes.go` + models), **bukan** `openapi-spec.yaml` di folder ini (sudah usang).

## 0. Fakta dasar backend

| Hal | Nilai |
|---|---|
| Lokasi | `../konsera-backend` (sibling folder repo ini). Go + Gin, `database/sql` (tanpa ORM) |
| Base URL lokal | `http://localhost:8080`, **tanpa** prefix `/api/v1`. Swagger: `/swagger/index.html`. Health: `/ping` |
| Envelope | `{ success, message, data?, error? }`. **Tidak ada `meta`/pagination** di endpoint mana pun |
| Status error | Hampir semua error → 400 dengan `message` = teks error Go (mis. `"[ERROR] Invalid email or password"`). `sql.ErrNoRows` → 404 di beberapa handler. Tidak ada kode `ERR_*` |
| Auth | Header `Authorization: Bearer <jwt>` saja. JWT HS256, **15 menit**, tanpa refresh token, tanpa logout. Claims: `user_id, name, email, roles[]` |
| CORS | **Tidak ada middleware CORS**. Browser tidak bisa memanggil langsung dari `localhost:3000` → pakai BFF/proxy Next |
| Publik | Hanya `/auth/*` (kecuali preferences), `/ping`, `/swagger`. **Semua endpoint lain wajib login**, termasuk `GET /events` |
| Rate limit | Login 5/menit, auth lain 20/menit, sisanya 60/menit per IP |
| Env yang dibaca | `DB_*`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`, `KONSERA_FE_URL` |
| Masalah env (per 24 Nov) | `.env` backend tidak punya `JWT_SECRET` dan `KONSERA_FE_URL`; memakai `SMTP_EMAIL` padahal kode membaca `SMTP_USERNAME`/`SMTP_FROM_*` |
| Seed migrasi | Roles (`super_admin, admin_event, organizer, customer, gatekeeper`) + `commission_settings` global 7.5%. Belum ada admin, payment method, kategori |
| Migrasi | `000001` (schema lengkap), `000002`, `000003` (soft delete). File `down` 000002/000003 tidak ada, `000001.down` kosong |

## 1. Masalah backend yang memutus alur (blocker)

| # | Masalah | Lokasi backend | Dampak ke FE |
|---|---|---|---|
| 1 | **Tiket tidak pernah dibuat.** Tidak ada `INSERT INTO tickets` di seluruh kode | — | My tickets, e-ticket, QR, transfer, gate selalu kosong |
| 2 | **Pembayaran tidak bisa dikonfirmasi.** Tidak ada gateway/webhook. `PUT /checkout/payments/:id` khusus admin, tapi query memfilter `b.user_id = <admin>` → admin hanya bisa mengubah payment booking miliknya sendiri | `repository/checkout/payment_repository.go` `UpdatePayment` | Booking tidak pernah `paid`; trigger `deduct_inventory_after_payment` tak pernah jalan |
| 3 | **Role `organizer` tidak pernah diberikan.** Role hanya ditambahkan saat register (`customer`). Approve verifikasi tidak menambah role | `services/user/user_services.go`, `services/organizer` | Organizer yang sudah disetujui tetap tidak bisa membuat venue/event (`RequireRole("organizer", …)`) |
| 4 | **Login & register gagal bila email gagal.** Login menolak bila email notifikasi login gagal; register mengirim OTP di dalam transaksi | `services/user/user_services.go` `Login`, `CreateUser` | Tanpa SMTP yang benar, auth mati total |
| 5 | **`held_count` bocor.** Cart kedaluwarsa, booking dibatalkan/kedaluwarsa tidak mengembalikan stok; tidak ada job yang menandai booking `expired` | `repository/checkout/checkout_repository.go` | Kuota tampak habis seiring waktu; status `expired` tak pernah muncul |
| 6 | **Platform fee selalu 0** meski `commission_settings` 7.5% ada | `Checkout()` | Total checkout tidak sesuai PRD |
| 7 | **`GET /events` mengembalikan semua event** (draft & milik siapa pun), tanpa filter/pagination/venue/kategori/tanggal; `category_ids` tidak diisi saat dibaca | `repository/event/event_repository.go` | Katalog/home tidak bisa dipakai apa adanya |
| 8 | `Checkout()` saat cart kosong: `MIN(held_until)` = NULL → error scan, bukan "cart is empty" | `checkout_repository.go` | Pesan error tidak ramah |

## 2. Celah keamanan (harus diperbaiki di backend)

1. `PUT /checkout/bookings/:id {"status":"paid"}`: pembeli bisa menandai pesanannya sendiri lunas.
2. `PUT /organizers/:id {"verification_status":"approved"}`: organizer bisa menyetujui dirinya sendiri.
3. `PUT /events/:id`: tanpa cek kepemilikan (organizer mana pun bisa mengubah event siapa pun) dan tanpa validasi transisi status (bisa langsung `published`). `POST /events` menerima `organizer_id` dari body.
4. `POST /organizers` menerima `user_id` dari body, bukan dari token.
5. `GET /organizers` terbuka untuk semua user login, termasuk data rekening bank.
6. Check-in: tiket berstatus `transferred` tidak pernah diubah ke `checked_in` (`UPDATE … WHERE status='issued'`) → **bisa di-scan berulang**.
7. `qr_token` statis (tidak berotasi) dan ikut terkirim di response tiket.
8. `PUT /community/reviews/:id` menerima `status` dari pemilik review (pemilik bisa mengubah status review sendiri).

## 3. Perbedaan schema per domain

Sumber FE: `src/types/*`. Sumber BE: `internal/models/*` + `internal/DTO/*`.

| Domain | Frontend | Backend |
|---|---|---|
| Envelope | `data, meta, errors` | `data, error`; tanpa `meta` |
| User / Session | `UserSchema { full_name, avatar_url, phone, created_at }`, `SessionSchema { roles, organizer_id }` | Login → `{ token, user: { id, profile_id, name, email, phone, auth_provider, provider_uid, status } }`. Roles hanya di JWT. Tanpa `organizer_id`, tanpa `/users/me`. Profil (`user_profiles`: full_name, avatar_url, date_of_birth, gender, address_line, city, province, postal_code, country) tidak punya endpoint baca/ubah |
| Register | Form: name, email, password (+ confirm) | `{ full_name, email, phone, password }` — **`phone` wajib** |
| Verify OTP | `/verify-otp?email=` | `POST /auth/verify-otp { profile_id, code:int }` (profile_id dari response register). OTP berlaku 5 menit. `POST /auth/resend-otp { profile_id }` |
| Preferensi | GET/PUT, `favorite_genres`, `notify_*` | Hanya `POST /auth/users/preferences` (INSERT sekali; panggilan kedua gagal karena unique `user_id`). Ada `marketing_opt_in`. Tidak ada kolom artis favorit |
| Venue | `timezone`, `latitude/longitude` wajib | Tanpa timezone. Ada `address, province, country`; lat/long nullable |
| Event | `venue` (objek), `categories: string[]`, `banner_url`, `starts_at`; URL pakai **slug** | `venue_id`, `organizer_id`, `category_ids` (tidak terisi saat dibaca), `is_featured`, `terms_and_conditions`, `refund_policy`, `rejection_reason`, `approved_at`. `description`/`poster_url`/`min_price`/`max_price` nullable. Tanpa `starts_at`. Lookup hanya by **id** |
| Session | `{ name, start_at, end_at, artists[] }` | `{ session_name?, start_at, end_at, gate_open_at, gate_close_at, status }`. Lineup lewat `GET /sessions/:id/artists` → `{ artist_id, role, performance_order, stage_time }` saja |
| Artist | `image_url` | `photo_url`, `bio` |
| Ticket tier | `available_quota` | Tidak ada. Kuota di `GET /ticket-tiers/:tier_id/inventory` per sesi (`total_quota, sold_count, held_count`). Ada `sale_start_at, sale_end_at` |
| Venue section / seat | sesuai | sesuai (sections & seats di bawah `/venues/:id/...`). Tidak ada endpoint ketersediaan kursi (seat-map) |
| Cart | `unit_price, line_total, held_until` | `{ id, ticket_tier_id, event_session_id, seat_id?, quantity, held_until }`; hold **15 menit**; maks 6 per item (bukan per transaksi) |
| Booking | `items[]`; URL pakai **booking_code** | Tanpa `items` (booking_items tidak diekspos). Ada `event_id, promo_code_id, paid_at, cancelled_at, created_at`. Lookup by id. `POST /checkout/bookings { event_id }` mengambil **semua** cart aktif untuk event itu |
| Order history (`UserOrder`) | event, sesi, venue, metode bayar, refund ter-join | `GET /checkout/bookings` = baris `bookings` mentah |
| Payment method | `{ code, name, category(enum) }` | `{ id, name, type(string bebas), provider, is_active, icon_url }` |
| Payment | `payment_url, va_number, qr_string, expires_at` | `{ booking_id, payment_method_id, provider_transaction_id?, amount, status, expires_at?, paid_at? }`. `POST /checkout/payments { booking_id, payment_method_id, amount, expires_at? }` (amount diambil dari booking) |
| Ticket | event, sesi, tier, kursi, venue, holder, `qr_code_url` | `{ id, booking_item_id, owner_user_id, ticket_code, qr_token, qr_token_updated_at, status, watermark_user_hash, issued_at }` |
| Transfer | `{ to_email }`, langsung berlaku | `POST /tickets/:id/transfers { to_user_id }` → `pending`; penerima `PUT /ticket-transfers/:id { status: accepted/rejected/cancelled }`. Tanpa kunci H-1. Tanpa lookup user by email |
| Check-in | kirim token QR; hasil `success/duplicate/invalid/expired` | `POST /check-ins { ticket_id, event_session_id, result(wajib, diabaikan server), device_id?, is_offline_sync?, scanned_at? }`. Hasil: `success, duplicate, invalid, expired, not_yet_open, closed`. `GET /check-ins?ticket_id=` saja; tidak ada statistik |
| Promo | `discount_type: fixed`, `used_count`, `starts_at/ends_at`, `usage_limit` wajib, `status` | `fixed_amount`, `usage_count`, `valid_from/valid_until`, `usage_limit` nullable, tanpa `status`, tanpa `organizer_id`. `event_id = null` = **berlaku di seluruh platform**. Pasang promo: `POST /checkout/bookings/:id/promo { code }` → `PromoCodeUsage` |
| Review | `user_full_name`, status `published/hidden` | `{ event_id, user_id, booking_id, rating, comment?, photo_urls?, status: visible/hidden/reported }`. `GET /community/reviews?event_id=` (termasuk yang hidden) |
| Favorit | cookie demo | `GET/POST /community/favorites`, `DELETE /community/favorites/:event_id` — **cocok**, hanya berisi `event_id` |
| Refund | `reason` enum, `note`, `eligible`, `deadline`, `rejection_reason` | `POST /checkout/refunds { booking_id, payment_id, amount, reason? }`; status `requested/approved/rejected/processed`; keputusan oleh admin; tanpa kolom alasan penolakan |
| Notification | `{ type, title, body, link, is_read }` | `{ channel, title?, body?, status?, metadata?, read_at?, template_id? }`. Tandai dibaca: `PUT /notifications/:id { read: true }`. Sistem tidak pernah membuat notifikasi otomatis |
| Organizer | `OrganizerSchema` (sesuai) | sesuai + `tax_id`, rekening bank, `commission_rate_override`. Tidak ada "organizer milik saya" (harus list semua lalu filter `user_id`) |
| Dokumen organizer | `id_card`, `business_license`, upload file | `POST /organizers/:id/verifications { document_type, document_url(URL) }`. **Tidak ada endpoint upload file** |
| Payout | `commission_rate_percent, is_estimate`, 3 status | 5 status (+`failed`, `on_hold`). `POST /admin/payouts` wajib mengirim `gross_amount, commission_amount, net_amount, scheduled_at` (FE dilarang menghitung uang) |
| Komisi | — | CRUD `/admin/commissions` tersedia |
| Mata uang | `formatPrice` USD | NUMERIC; template email Rupiah. **Keputusan user: pakai Rupiah** |

**Sudah cocok:** enum status event/booking/payment/ticket/user/organizer, field uang booking, venue sections & seats, organizer + organizer_verifications, favorites, `gate_open_at/gate_close_at` per sesi.

## 4. Alur yang bertentangan dengan keputusan user (memory.md §7)

| Aturan yang disepakati | Backend sekarang |
|---|---|
| Pesanan belum dibayar kedaluwarsa **1 jam** | `hold_expires_at` booking = hold cart (**15 menit**); tidak ada job expiry |
| Transfer langsung berlaku, tidak bisa dibatalkan, terkunci H-1 | Ada langkah accept/reject/cancel; tanpa kunci H-1 |
| Refund penuh per pesanan, diputuskan **organizer**, tutup 7 hari sebelum acara, ditolak bila ada tiket ditransfer | User mengisi nominal; keputusan admin; aturan 7 hari & transfer tidak dicek |
| Review hanya penonton yang sudah check-in, setelah event selesai, maks 3 foto; moderasi admin | Tanpa cek kehadiran/waktu/jumlah foto. Admin **tidak bisa** menyembunyikan review orang lain (query memfilter `user_id = pemanggil`) |
| Promo milik organizer; yang sudah dipakai tidak bisa diedit/dihapus | Promo tanpa pemilik; edit/hapus tidak dibatasi |
| Verifikasi 2 level: KYC organizer + izin keramaian per event | Tidak ada kolom izin keramaian. Approve organizer tidak memberi role |
| Event yang di-approve admin langsung publish; setelah publish hanya banner & deskripsi bisa diedit | Status diubah bebas lewat `PUT /events/:id`; tidak ada pembatasan field |
| Gatekeeper dibuat organizer, ditugaskan per event | Tidak ada endpoint buat akun gatekeeper / penugasan; `POST /check-ins` tidak cek penugasan |
| Zona waktu venue (IANA) | Venue tanpa timezone |

Catatan urutan alur yang berubah di FE:
- **Checkout:** `POST /checkout/carts` (per tier/sesi) → `POST /checkout/bookings { event_id }` → (opsional) `POST /checkout/bookings/:id/promo` → `GET /checkout/payment-methods` → `POST /checkout/payments`.
- **Wizard event** harus memanggil berurutan: venue → section → **kursi satu per satu** (grid 26×60 = 1.560 request) → event → sesi → artis → lineup → tier → inventory per tier per sesi. Perlu endpoint batch dari backend.

## 5. Layar FE yang belum punya endpoint

- **Akun:** `/users/me` (GET/PUT profil), ganti password, lupa/reset password, refresh token, GET/PUT preferensi, OAuth Google/Apple.
- **Event publik:** filter/pencarian/pagination, featured, lookup by slug, seat-map dengan ketersediaan.
- **Organizer:** organizer milik saya, dashboard/analytics/penjualan, refund per event organizer, gatekeeper (CRUD + penugasan), payout milik organizer, submit event untuk review.
- **Admin:** daftar user + ubah status (suspend/ban), ringkasan keuangan/GMV, antrean event pending, antrean verifikasi organizer, refund force majeure, kandidat payout (angka dihitung BE).
- **Transaksi & tiket:** detail booking_items, data tiket ter-join (event/sesi/tier/venue/holder), QR dinamis, statistik check-in, invoice PDF.
- **Upload file:** dokumen organizer, poster, banner, foto review, izin keramaian.

## 6. Usulan permintaan ke tim backend (urut prioritas)

1. Lengkapi `.env` (`JWT_SECRET`, `KONSERA_FE_URL`, nama variabel SMTP) dan jangan gagalkan login bila email notifikasi gagal.
2. Konfirmasi pembayaran (webhook gateway atau endpoint simulasi untuk UKK) + **terbitkan tiket** saat payment `success`.
3. Tutup celah §2 (status booking oleh pembeli, self-approve organizer, kepemilikan event, `user_id`/`organizer_id` dari token, check-in tiket transferred).
4. Beri role `organizer` saat verifikasi disetujui; endpoint "organizer milik saya".
5. Lepas `held_count` + job expiry booking (1 jam sesuai keputusan); hitung platform fee dari `commission_settings`.
6. `GET /events` publik untuk event `published` + filter, pagination, venue, kategori, tanggal mulai; lookup by slug.
7. Endpoint ter-join untuk layar berat: kartu event, order history, e-ticket.
8. `/users/me`, update preferensi, ganti/lupa password, refresh token.
9. Endpoint upload file.
10. Sisanya (§5) sesuai urutan fitur yang dikerjakan.

## 7. Yang bisa dikonsumsi FE sekarang (setelah env backend benar)

- **Auth:** register (tambah field phone di form, simpan `profile_id` untuk OTP), verify/resend OTP, login (token disimpan di httpOnly cookie lewat BFF), simpan preferensi sekali saat profiling.
- **Baca event:** list (perlu filter `published` di FE sementara — konfirmasi ke user dulu), detail, sesi, lineup + artis, tier, inventory.
- **Favorit:** list/tambah/hapus.
- **Notifikasi:** list, detail, tandai dibaca, hapus.
- **Pengajuan organizer:** create organizer + verifikasi (tanpa upload file; butuh URL dokumen).
- **Venue/section/seat** untuk wizard (setelah role organizer beres).
