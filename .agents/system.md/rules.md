# rules.md — Aturan untuk AI Coding Agent · Proyek Konsera

> Berlaku untuk semua AI agent (Claude Code, Cursor, Copilot, dll). Taruh di root repo.
> Salin/symlink ke `CLAUDE.md`, `AGENTS.md`, atau `.cursor/rules/` sesuai tool yang dipakai.
>
> Kata **WAJIB** / **DILARANG** = aturan keras. **Sebaiknya** = default, boleh dilanggar dengan alasan tertulis.

---

## 0. Hierarki Sumber Kebenaran

Urutan prioritas bila ada konflik:

1. Instruksi eksplisit user pada task yang sedang dikerjakan
2. `docs/database-schema.sql` — struktur data (tabel, kolom, enum, constraint, trigger)
3. `docs/openapi-spec.yaml` — kontrak API antara BE dan FE
4. `docs/PRD.md` — business rules (Bagian 9 = aturan bisnis final)
5. `docs/design.md` (Stagelight) — visual, token, motion
6. File ini — cara menulis kode

**WAJIB**: Bila dua sumber bertentangan, atau aturan bisnis tidak tertulis → **STOP dan tanya**. Jangan menebak.
Daftar konflik yang sudah diketahui ada di **§15** — baca sebelum mengerjakan modul terkait.

---

## 1. Aturan Perilaku Agent (paling penting)

### 1.1 Scope — kerjakan hanya yang diminta
- **DILARANG** "sekalian" refactor, rename, upgrade dependency, reformat file lain, atau merapikan kode di luar task.
- **DILARANG** membuat fitur yang tidak ada di PRD (contoh: loyalty point, chat antar user, light mode, multi-currency, wishlist sharing).
- **DILARANG** membuat endpoint, tabel, kolom, atau WebSocket event yang tidak ada di `openapi-spec.yaml` / `database-schema.sql`. Bila memang perlu → usulkan perubahan spec dulu, tunggu persetujuan.
- **DILARANG** membuat halaman/route di luar yang tercantum di PRD §6.1 & §13 tanpa diminta.
- Satu task = satu concern. Diff sekecil mungkin yang menyelesaikan task.

### 1.2 Cari dulu sebelum membuat (anti-duplikasi)
Sebelum membuat **type, schema, komponen, hook, util, constant, query key, error code** baru, **WAJIB** cari:

```bash
rg -n "BookingSchema|type Booking\b" packages/ apps/
rg -n "export (function|const) use[A-Z]" apps/web/src/hooks packages/
rg -n "formatIDR|formatDate" packages/ apps/
rg -ln "TicketCard|GlowOrb|Perforation" apps/web/src/components
```

- Ada yang sudah 80% mirip → **extend / tambah prop / derivasi**, bukan copy-paste.
- **DILARANG** membuat `utils2.ts`, `helpers-new.ts`, `ButtonV2.tsx`, `useBookingNew`, dsb.
- **DILARANG** membuat util yang sudah tersedia native (`Array.prototype.at`, `structuredClone`, `Intl.NumberFormat`, `Object.groupBy`, dll).

### 1.3 Tanpa kode palsu
- **DILARANG** mock data / array hardcode di kode produksi. Mock hanya di `__fixtures__/`, `*.stories.tsx`, `*.test.ts(x)`, `*_test.go`.
- **DILARANG** stub yang pura-pura berhasil (mis. `processPayment()` selalu return sukses, `checkIn()` selalu `success`).
- **DILARANG** `// TODO: implement` sebagai pengganti logic yang diminta. Kalau tidak bisa diselesaikan, katakan apa yang kurang.
- **DILARANG** meng-comment-out kode lama "untuk jaga-jaga". Hapus — git menyimpan history.
- **DILARANG** menulis komentar yang mengulang kode (`// increment i`). Komentar hanya untuk *kenapa*, bukan *apa*.

### 1.4 Dependency
- Hanya pakai dependency di **§3**. Selain itu → **tanya dulu** dengan alasan + alternatif native.
- **DILARANG** dua library untuk fungsi yang sama dalam satu app (dua date lib, dua HTTP client, dua animation lib, dua icon set).

### 1.5 Saat ragu
- Tanya dengan opsi konkret (A / B / C + konsekuensinya), bukan pertanyaan terbuka.
- Untuk aturan bisnis (harga, inventori, refund, check-in, window waktu) **selalu** tanya, jangan asumsi.

### 1.6 Format laporan setelah selesai
1. Daftar file dibuat/diubah/dihapus
2. Ringkasan perubahan (maks. 5 poin)
3. Hasil Definition of Done (§14) — sebutkan bila ada yang gagal, jangan disembunyikan
4. Asumsi yang diambil (bila ada)

---

## 2. Struktur Monorepo

> Asumsi: pnpm workspaces + Turborepo (PRD mensyaratkan package `@konsera/shared-types`, jadi monorepo).

```
konsera/
├── apps/
│   ├── web/                 # Next.js 14 App Router
│   ├── mobile/              # Expo + Expo Router
│   └── api/                 # Go 1.22 + Gin
├── packages/
│   ├── shared-types/        # @konsera/shared-types  → Zod schema, type, enum, constants, WS events, error codes
│   ├── api-client/          # @konsera/api-client    → fetch wrapper, fungsi endpoint, query key factory
│   ├── design-tokens/       # @konsera/design-tokens → token Stagelight (satu-satunya tempat nilai warna)
│   └── config/              # eslint, tsconfig, prettier bersama
├── docs/                    # PRD.md, design.md, database-schema.sql, openapi-spec.yaml
└── scripts/                 # check-rules.sh, dll
```

### 2.1 Batas import (WAJIB)
| Dari → Ke | Boleh? |
|---|---|
| `apps/*` → `packages/*` | ✅ via nama package (`@konsera/...`), bukan path relatif |
| `packages/*` → `apps/*` | ❌ |
| `apps/web` ↔ `apps/mobile` | ❌ — kode bersama dipindah ke `packages/` |
| `shared-types` → apa pun selain `zod` | ❌ (zero runtime dependency lain) |
| `design-tokens` → apa pun | ❌ (pure data) |

### 2.2 Di mana menaruh apa
| Jenis kode | Lokasi tunggal |
|---|---|
| Tipe entitas domain, request/response, enum | `packages/shared-types/src/` |
| Konstanta bisnis (max tiket, dll) | `packages/shared-types/src/constants.ts` |
| Kode error (`ERR_*`) | `packages/shared-types/src/error-codes.ts` + `apps/api/internal/apperror/codes.go` |
| Nama & payload WebSocket event | `packages/shared-types/src/ws-events.ts` |
| Fungsi pemanggil API & query keys | `packages/api-client/src/` |
| Nilai warna, radius, motion, glow | `packages/design-tokens/src/tokens.ts` |
| Formatter (IDR, tanggal) | `packages/shared-types/src/format.ts` |
| Komponen UI web | `apps/web/src/components/{ui,forms,layouts,features}` |
| Hook web | `apps/web/src/hooks/` |
| Store Zustand web | `apps/web/src/stores/` (maks. `auth`, `selection`, `ui`) |

---

## 3. Dependency yang Disetujui

### 3.1 Web (`apps/web`)
`next@14`, `react`, `typescript`, `tailwindcss@3`, shadcn/ui (Radix), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (satu-satunya icon set), `@tanstack/react-query`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `html5-qrcode` (scanner web), `react-qr-code` (render QR e-ticket), satu library Google Maps (default: `@vis.gl/react-google-maps`).

### 3.2 Mobile (`apps/mobile`)
`expo`, `expo-router`, `expo-camera` (scan QR — **bukan** `react-qr-reader`, lihat §15), `expo-secure-store`, `expo-font`, `expo-notifications`, `react-native-svg`, `react-qr-code`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`.

### 3.3 Backend (`apps/api`)
`gin`, driver/query layer **satu pilihan** (lihat §15), `redis/go-redis/v9`, `go-redsync/redsync` (Redlock), `uber-go/zap`, `golang-jwt/jwt/v5`, `golang.org/x/crypto/bcrypt`, `golang-migrate/migrate`, `stretchr/testify`, satu library WebSocket.

### 3.4 Dev tooling (semua workspace)
`eslint@8`, `typescript-eslint@8`, `eslint-config-next`, `eslint-config-prettier`, `eslint-plugin-tailwindcss`, `eslint-plugin-simple-import-sort`, `@tanstack/eslint-plugin-query`, `prettier`, `prettier-plugin-tailwindcss`, `knip` (unused file/export/dependency), `jscpd` (deteksi copy-paste), `jest`, `@testing-library/react`, `playwright`, `detox`, `storybook`, `golangci-lint` v2.

### 3.5 DILARANG tanpa izin eksplisit
`axios`, `ky`, `swr`, `redux`/`@reduxjs/toolkit`, `mobx`, `formik`, `yup`, `joi`, `moment`, `dayjs`, `luxon`, `lodash` (full), `styled-components`, `@emotion/*`, MUI/Chakra/AntD/Mantine, icon set selain lucide, `framer-motion`/`gsap` (lihat §9.7), `uuid` (pakai `crypto.randomUUID()`), GORM `AutoMigrate`.

---

## 4. Aturan Type — Anti Duplikasi

### 4.1 Rantai sumber tunggal

```
database-schema.sql ──(golang-migrate)──► PostgreSQL
openapi-spec.yaml   ──► KONTRAK API (BE & FE wajib patuh)
      ├──► Go DTO        apps/api/internal/<modul>/dto.go
      └──► Zod schema    packages/shared-types  ──z.infer──► TS type
                                   ├──► form schema (derivasi .pick/.extend)
                                   └──► api-client (parse response)
```

Perubahan kontrak API **WAJIB** urutannya: `openapi-spec.yaml` → Go DTO → Zod schema → pemakai. Satu PR.

### 4.2 Aturan TypeScript type
- **WAJIB**: Zod schema adalah sumber; type diturunkan. **DILARANG** menulis `interface` paralel dengan schema.
  ```ts
  // packages/shared-types/src/booking.ts
  export const BookingStatusSchema = z.enum(BOOKING_STATUSES);
  export const BookingSchema = z.object({ id: z.string().uuid(), status: BookingStatusSchema, /* ... */ });
  export type Booking = z.infer<typeof BookingSchema>;
  ```
- **WAJIB**: Variasi dibuat dengan derivasi, bukan deklarasi ulang.
  ```ts
  export const CreateBookingRequestSchema = BookingSchema.pick({ /* ... */ }).extend({ promo_code: z.string().optional() });
  export type BookingSummary = Pick<Booking, 'id' | 'status' | 'total_amount'>;
  ```
- **DILARANG** mendeklarasikan tipe domain (`User`, `Booking`, `Ticket`, dst.) atau tipe berakhiran `Request`/`Response`/`Payload` di luar `shared-types` (di-enforce ESLint §6.2).
- **WAJIB**: Envelope response didefinisikan **sekali**:
  ```ts
  export const apiResponseSchema = <T extends z.ZodTypeAny>(data: T) => z.object({
    success: z.boolean(), message: z.string(), data, meta: PaginationMetaSchema.nullable().optional(), errors: z.array(FieldErrorSchema).nullable(),
  });
  export type ApiResponse<T> = { success: boolean; message: string; data: T; meta?: PaginationMeta | null; errors: FieldError[] | null };
  ```
- **DILARANG** `enum` TypeScript. Pakai `as const` + `z.enum`. Nilai string **harus persis** sama dengan enum di DB.
  ```ts
  export const EVENT_STATUSES = ['draft', 'pending_review', 'approved', 'rejected', 'published'] as const;
  ```
- **WAJIB**: Nama field mengikuti JSON API apa adanya (`snake_case`). **DILARANG** membuat layer mapper camelCase + tipe kembarannya.
- **WAJIB**: Response API di-`parse` dengan Zod di `api-client` (satu tempat). **DILARANG** `as Booking` pada data dari network.
- Props komponen boleh `type Props = {...}` lokal, tidak di-export kecuali dipakai ulang.
- **Penamaan**: `Event` dan `Notification` bentrok dengan global DOM → pakai **`ConcertEvent`** dan **`AppNotification`** (lihat §15).

### 4.3 Konstanta bisnis
- Satu tempat: `packages/shared-types/src/constants.ts` (`MAX_TICKETS_PER_TRANSACTION = 6`, dsb).
- Backend tetap **otoritatif** — konstanta di FE hanya untuk UX (disable tombol, pesan validasi).
- **DILARANG** menghitung countdown hold dari konstanta FE. Countdown **WAJIB** dari `held_until` yang dikirim server.

### 4.4 Uang & waktu
- **DILARANG** menghitung total, diskon, platform fee, atau harga final di FE. FE hanya menampilkan angka dari BE.
- Format rupiah hanya lewat `formatIDR()` (satu fungsi, `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`).
- Go: uang `int64` (rupiah utuh) atau tipe decimal sesuai schema — **DILARANG** `float64` untuk uang.
- Waktu dari API: ISO 8601 dengan offset. Simpan di DB sebagai `timestamptz` (UTC). Format tampilan lewat helper `formatDateTime()` berbasis `Intl.DateTimeFormat` (tanpa library tanggal).

### 4.5 Go types
- Maksimal dua bentuk per entitas: **model** (repository, cermin tabel) dan **DTO** (handler, cermin OpenAPI). Mapping di satu fungsi per arah. **DILARANG** layer ketiga.
- Kode error: konstanta di `internal/apperror/codes.go`, **harus identik** dengan `shared-types/error-codes.ts` dan PRD §10.1. Kode baru → tambah di keduanya dalam PR yang sama.

---

## 5. Aturan TypeScript

`packages/config/tsconfig/base.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  }
}
```
Web menambah `"lib": ["ES2022", "DOM", "DOM.Iterable"]`; mobile extends `expo/tsconfig.base` lalu base ini.

Aturan:
- **DILARANG** `any` (pakai `unknown` + narrowing / Zod).
- **DILARANG** non-null assertion `!`.
- **DILARANG** `@ts-ignore`. `@ts-expect-error` hanya dengan alasan tertulis.
- **DILARANG** `as` untuk data domain. `as const` boleh.
- **WAJIB** `import type` untuk import yang hanya type.
- **WAJIB** `switch` atas union di-exhaustive (`switch-exhaustiveness-check`).
- **DILARANG** mematikan rule lint dengan `eslint-disable` tanpa komentar alasan `-- <alasan>`.

---

## 6. Lint & Format

### 6.1 Prettier — `packages/config/prettier.json`
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "cva"]
}
```

### 6.2 ESLint web — `apps/web/.eslintrc.cjs`
> Next 14 memakai ESLint 8 + format `.eslintrc`. Mobile memakai base yang sama tanpa `next/*` dan `tailwindcss`.

```js
const DOMAIN_TYPES =
  'User|Organizer|Venue|VenueSection|Seat|ConcertEvent|Event|EventSession|TicketTier|TicketInventory|' +
  'Cart|Booking|BookingItem|Payment|Ticket|CheckIn|AppNotification|Notification|Review|Promo|ApiResponse';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { projectService: true, tsconfigRootDir: __dirname },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@tanstack/query/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  settings: { tailwindcss: { callees: ['cn', 'cva'] } },
  rules: {
    // --- type safety ---
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // --- anti-duplikasi & anti-bloat ---
    'no-restricted-syntax': [
      'error',
      { selector: 'TSEnumDeclaration', message: 'Pakai `as const` array + z.enum di @konsera/shared-types.' },
      { selector: `TSInterfaceDeclaration[id.name=/^(${DOMAIN_TYPES})$/]`, message: 'Tipe domain hanya boleh di @konsera/shared-types.' },
      { selector: `TSTypeAliasDeclaration[id.name=/^(${DOMAIN_TYPES})$/]`, message: 'Tipe domain hanya boleh di @konsera/shared-types.' },
      { selector: 'TSTypeAliasDeclaration[id.name=/(Request|Response|Payload)$/]', message: 'Tipe kontrak API hanya di @konsera/shared-types.' },
      { selector: 'TSInterfaceDeclaration[id.name=/(Request|Response|Payload)$/]', message: 'Tipe kontrak API hanya di @konsera/shared-types.' },
      // --- design tokens ---
      { selector: 'Literal[value=/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]', message: 'Hex hardcode dilarang — pakai token Stagelight.' },
      { selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{6}\\b/]', message: 'Hex hardcode dilarang — pakai token Stagelight.' },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          { name: 'axios', message: 'Pakai @konsera/api-client.' },
          { name: 'swr', message: 'Pakai TanStack Query.' },
          { name: 'moment', message: 'Pakai helper Intl di @konsera/shared-types.' },
          { name: 'dayjs', message: 'Pakai helper Intl di @konsera/shared-types.' },
          { name: 'lodash', message: 'Pakai JS native.' },
          { name: 'uuid', message: 'Pakai crypto.randomUUID().' },
        ],
        patterns: [
          { group: ['**/packages/*/src/**', '../../packages/**'], message: 'Import via nama package @konsera/*.' },
          { group: ['**/apps/mobile/**'], message: 'Web tidak boleh import dari mobile.' },
        ],
      },
    ],
    'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],

    // --- keamanan & kebersihan ---
    'react/no-danger': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // --- tailwind ---
    'tailwindcss/no-arbitrary-value': 'error',
    'tailwindcss/classnames-order': 'off', // ditangani prettier-plugin-tailwindcss
  },
  overrides: [
    { files: ['src/components/ui/**'], rules: { 'max-lines': 'off' } }, // hasil generate shadcn
    {
      files: ['**/*.test.{ts,tsx}', '**/*.stories.tsx', '**/__fixtures__/**'],
      rules: { '@typescript-eslint/no-non-null-assertion': 'off', 'max-lines': 'off' },
    },
  ],
  ignorePatterns: ['.next/', 'node_modules/', 'coverage/', '**/generated/**'],
};
```

`packages/shared-types` dan `packages/design-tokens` memakai override yang mematikan aturan `DOMAIN_TYPES` & hex — **hanya** di dua package itu.

### 6.3 Deteksi kode mati & duplikat
`knip.json` (root):
```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "workspaces": {
    "apps/web": {},
    "apps/mobile": {},
    "packages/*": {}
  },
  "ignore": ["**/components/ui/**"]
}
```

`.jscpd.json` (root):
```json
{
  "threshold": 3,
  "minTokens": 50,
  "reporters": ["console"],
  "ignore": ["**/node_modules/**", "**/.next/**", "**/components/ui/**", "**/*.test.*", "**/generated/**", "**/migrations/**"]
}
```

### 6.4 Go — `apps/api/.golangci.yml` (golangci-lint v2)
```yaml
version: "2"
run:
  timeout: 5m
linters:
  default: standard          # errcheck, govet, ineffassign, staticcheck, unused
  enable:
    - bodyclose
    - contextcheck
    - dupl                   # deteksi kode duplikat
    - errorlint
    - exhaustive
    - forbidigo
    - gocritic
    - gosec                  # termasuk G201/G202 (SQL string concat)
    - misspell
    - nilerr
    - noctx
    - revive
    - rowserrcheck
    - sqlclosecheck
    - unparam
  settings:
    dupl:
      threshold: 120
    exhaustive:
      default-signifies-exhaustive: true
    forbidigo:
      forbid:
        - pattern: ^fmt\.Print.*$
          msg: Pakai zap logger.
        - pattern: ^log\.(Print|Fatal|Panic).*$
          msg: Pakai zap logger.
        - pattern: \.AutoMigrate$
          msg: Perubahan schema hanya lewat file migrasi.
formatters:
  enable:
    - gofmt
    - goimports
```

### 6.5 Commit
Conventional Commits: `feat(booking): ...`, `fix(checkin): ...`, `chore(deps): ...`. Scope = nama modul PRD (`auth`, `event`, `booking`, `payment`, `ticket`, `checkin`, `notif`, `review`, `admin`, `landing`).

---

## 7. Backend (Go + Gin)

### 7.1 Struktur
```
apps/api/
├── cmd/api/main.go
├── internal/
│   ├── config/
│   ├── apperror/            # codes.go, error type
│   ├── response/            # helper envelope — satu-satunya cara menulis response
│   ├── middleware/          # auth, rbac, ratelimit, requestid, recover
│   ├── platform/            # db, redis, logger, payment provider, ws hub, queue
│   └── <modul>/             # auth, event, booking, payment, ticket, checkin, ...
│       ├── handler.go       # bind + validasi + panggil service + response
│       ├── service.go       # business logic + transaksi
│       ├── repository.go    # SQL saja
│       ├── dto.go
│       └── model.go
└── migrations/
```

### 7.2 Aturan layer
- Handler **DILARANG** menyentuh DB/Redis langsung. Repository **DILARANG** berisi business logic.
- `context.Context` **WAJIB** jadi argumen pertama di service & repository.
- Response **hanya** lewat `response.OK / Created / Fail` (envelope PRD §5.1). **DILARANG** `c.JSON(...)` manual di handler.
- Error ke client **hanya** kode dari `apperror`. **DILARANG** mengirim `err.Error()` internal ke client.
- SQL **WAJIB** parameterized. **DILARANG** `fmt.Sprintf` untuk query.
- Payment gateway **hanya** lewat interface `PaymentProvider`. Implementasikan **hanya** provider yang sudah dipilih (§15).
- Otorisasi RBAC **WAJIB** di middleware + dicek ulang kepemilikan resource di service (organizer hanya boleh mengubah event miliknya).

### 7.3 Invariant bisnis (DILARANG dilanggar)
| Area | Aturan |
|---|---|
| Hold | Redis lock (Redlock) + optimistic locking `ticket_inventories.version`. Hold 10 menit, waktu dari server. Hold expired → release + broadcast `event:booking:release`. |
| Inventori | `sold_count` berubah **hanya** di jalur payment sukses, **tepat satu kali** — oleh trigger DB **atau** kode aplikasi, **tidak keduanya** (§15). |
| Max tiket | 6 per transaksi, divalidasi di BE (service + constraint DB bila ada). |
| Harga | Total, diskon, fee dihitung di BE. Fee dari `commission_settings`, **DILARANG** hardcode persentase. |
| Webhook | Verifikasi signature provider, idempotent (kunci: ID transaksi provider), diproses via queue, balas 200 cepat. |
| QR | Token dibuat & ditandatangani server. **DILARANG** agent merancang skema kriptografi sendiri (§15). |
| Check-in | One-time scan; scan kedua → `duplicate`. Multi-entry hanya untuk tier yang dikonfigurasi. Gate: buka 2 jam sebelum, tutup 1 jam setelah mulai. |
| Transfer | Terkunci mulai H-1. |
| Refund | Ditolak bila < 7 hari sebelum event, kecuali override admin (force majeure). |
| Event status | Transisi hanya `draft → pending_review → approved/rejected → published`. Validasi di service. |

### 7.4 Keamanan BE
- bcrypt cost ≥ 12. JWT access 15 menit, refresh 7 hari dengan rotation (refresh lama langsung invalid).
- Zap logger dengan masking: `password`, `token`, `access_token`, `refresh_token`, `authorization`, nomor kartu, query param `token` pada log akses WebSocket.
- Rate limit: 100 req/menit publik, 1000 req/menit terautentikasi (Redis).
- Konfigurasi & secret hanya dari env/secret manager. **DILARANG** hardcode secret, termasuk di test.
- Schema berubah **hanya** lewat file di `migrations/` (up + down).

---

## 8. Frontend Web (Next.js 14)

### 8.1 Komponen
- **Server Component default.** `'use client'` hanya bila butuh state, effect, event handler, atau browser API.
- Satu komponen per file. File > 300 baris → pecah.
- `components/ui/` = hasil generate shadcn. **DILARANG** dimodifikasi berat; bungkus di `components/features/` bila perlu variasi.

### 8.2 Data
- Server state **hanya** TanStack Query, lewat fungsi dari `@konsera/api-client`. **DILARANG** `fetch()` langsung di komponen.
- Query key **hanya** dari factory (`queryKeys.events.detail(id)`). **DILARANG** array key ditulis inline.
- Zustand **hanya** untuk: sesi auth (meta, bukan token), seleksi kursi/tier sebelum `POST /carts`, state UI (modal, filter). **DILARANG** menyalin data server (event, booking, cart yang sudah di-hold) ke Zustand.
- Sumber kebenaran cart = server (`carts` dengan `held_until`).
- Event WebSocket → `queryClient.setQueryData` / `invalidateQueries`. **DILARANG** state paralel untuk data real-time.

### 8.3 Form
React Hook Form + `zodResolver` dengan schema dari `@konsera/shared-types` (derivasi bila perlu). **DILARANG** schema validasi baru yang menduplikasi field schema domain.

### 8.4 Keamanan web
- Token **DILARANG** di `localStorage`/`sessionStorage`. Pakai httpOnly cookie (set oleh BE atau route handler BFF di `app/api`).
- `NEXT_PUBLIC_*` hanya untuk nilai publik (mis. Maps key yang dibatasi HTTP referrer).
- **DILARANG** `dangerouslySetInnerHTML` untuk konten user (review, forum, Q&A).
- Cek role di FE hanya untuk UX (sembunyikan menu). Otorisasi sebenarnya ada di BE.
- Gambar via `next/image`.

---

## 9. Design System — Stagelight

### 9.1 Token = satu sumber
`packages/design-tokens/src/tokens.ts` — **satu-satunya** file yang boleh berisi nilai warna.

```ts
export const colors = {
  bgBase: '#0B0B0E',
  bgSurface: '#16151C',
  bgSurface2: '#1E1D26',
  textPrimary: '#F5F3EF',
  textMuted: '#8D8A99',
  accentPink: '#FF3DA6',
  accentLime: '#C6FF3D',
  border: 'rgba(245,243,239,0.08)',
} as const;

export const radius = { card: '20px', pill: '999px' } as const;
export const layout = { containerMax: '1280px', gutter: '24px', columns: 12 } as const;
export const glow = { blurMinPx: 80, blurMaxPx: 120, opacityMin: 0.2, opacityMax: 0.35 } as const;
export const motion = { hoverMs: 200, staggerMs: 80, revealOffsetPx: 24, parallaxFactor: 0.4, parallaxMaxPx: 60 } as const;

// bgSurface2 → --color-bg-surface-2 (sesuai design.md)
export const cssVarName = (key: string) => `--color-${key.replace(/([A-Z0-9])/g, '-$1').toLowerCase()}`;
```

- Web: Tailwind plugin `addBase({ ':root': ... })` meng-generate CSS variable dari `colors` → **DILARANG** menulis ulang nilai hex di `globals.css`.
- Mobile: import `colors` langsung.
- **DILARANG** menambah warna baru tanpa persetujuan. Warna status (sukses/gagal/peringatan) **belum ada** di design.md → tanya dulu (§15).

### 9.2 Pemetaan Tailwind & shadcn
Warna shadcn **dipetakan** ke token Stagelight di `tailwind.config.ts` — **DILARANG** membuat palet kedua (format HSL shadcn default).

```ts
colors: {
  background: 'var(--color-bg-base)',
  foreground: 'var(--color-text-primary)',
  card: { DEFAULT: 'var(--color-bg-surface)', foreground: 'var(--color-text-primary)' },
  popover: { DEFAULT: 'var(--color-bg-surface-2)', foreground: 'var(--color-text-primary)' },
  primary: { DEFAULT: 'var(--color-accent-lime)', foreground: 'var(--color-bg-base)' },
  secondary: { DEFAULT: 'var(--color-bg-surface-2)', foreground: 'var(--color-text-primary)' },
  accent: { pink: 'var(--color-accent-pink)', lime: 'var(--color-accent-lime)' },
  muted: { DEFAULT: 'var(--color-bg-surface)', foreground: 'var(--color-text-muted)' },
  border: 'var(--color-border)',
  input: 'var(--color-border)',
  ring: 'var(--color-accent-pink)',
},
borderRadius: { card: '20px', pill: '999px' },
```
Catatan: modifier opacity Tailwind (`bg-accent-pink/20`) tidak bekerja pada variable hex di Tailwind v3. Untuk transparansi pakai komponen glow (§9.5), bukan arbitrary value.

### 9.3 Aturan warna
- **DILARANG** `#000`, `#000000`, `#fff`, `#ffffff`, `black`, `white`, `bg-black`, `bg-white`, `text-white`, `text-black`.
- **DILARANG** arbitrary value Tailwind (`bg-[#...]`, `p-[13px]`) — di-enforce ESLint.
- **WAJIB**: Teks di atas isian pink/lime pakai `--color-bg-base` (gelap). Teks terang di atas pink tidak lolos kontras WCAG AA.
- Muted text (`#8D8A99`) aman untuk body di atas semua surface gelap (kontras ≥ 4.5:1).

### 9.4 Tipografi
| Peran | Font | Kelas Tailwind | Boleh dipakai di |
|---|---|---|---|
| Logo | Ethnocentric | `font-logo` | **hanya** `components/brand/Logo.tsx` |
| Heading H1–H3 | Author | `font-display` | heading |
| Body, label, caption | Manrope | `font-sans` (default) | semua teks lain |
| Kutipan fans | Brittany Signature | `font-signature` | **hanya** `components/features/landing/FanQuote.tsx` |

- Load font via `next/font/local` (Ethnocentric, Author, Brittany Signature) dan `next/font/google` (Manrope). Mobile via `expo-font`.
- **DILARANG** mengganti font dengan "font mirip" dari Google Fonts secara diam-diam. File font tidak ada → tanya. Pastikan lisensi webfont/app sudah dimiliki.
- H1: leading 1.05, maksimal **satu kata** dengan gradient text pink→lime.

### 9.5 Komponen signature (satu implementasi, dipakai ulang)
| Komponen | Fungsi | Aturan |
|---|---|---|
| `TicketCard` | Kartu dengan notch sudut kanan-atas, radius 20px | Satu-satunya tempat implementasi notch. Semua card event memakai ini. |
| `Perforation` | Divider dashed + lingkaran kecil kiri-kanan | Satu-satunya divider "sobekan tiket". |
| `GlowOrb` | Radial glow pink/lime | Blur 80–120px, opacity 0.2–0.35, posisi asimetris, di belakang konten (`aria-hidden`, `pointer-events-none`). **DILARANG** glow full-bleed atau solid. |
| `SpotlightSweep` | Orb bergerak mengikuti scroll | Satu instance per halaman landing. |
| `Marquee` | Ticker infinite | Pause saat hover & saat reduced-motion. |
| `Logo` | Wordmark Ethnocentric | — |
| `FanQuote` | Testimoni Brittany Signature | Satu-satunya pemakai script font. |

**DILARANG** membuat ulang efek di atas secara inline di section lain.

### 9.6 Lingkup motion — landing vs transaksional
| Halaman | Token & tipografi | Spotlight / parallax / marquee / tilt / glow |
|---|---|---|
| Landing & marketing | ✅ | ✅ |
| Katalog, detail event | ✅ | Glow statis tipis saja |
| Seat map, cart, checkout, payment, e-ticket, scanner, dashboard organizer/admin | ✅ | ❌ |

- E-ticket: QR **WAJIB** modul gelap di atas latar terang (`--color-text-primary`) dengan quiet zone. **DILARANG** glow, watermark, atau overlay menimpa area QR.
- Scanner: feedback hijau/merah/kuning besar + suara/getar — warna menunggu token status (§15).
- Numbering dekoratif (`01 02 03`) **hanya** di section "Cara Kerja".

### 9.7 Motion
- Animasi hanya pada `transform` dan `opacity`.
- Reveal pakai `IntersectionObserver`; scroll effect pakai `requestAnimationFrame` + listener `passive`. Satu hook bersama (`useScrollProgress`, `useInView`).
- **WAJIB** `prefers-reduced-motion`: matikan drift orb, parallax, tilt cursor; sisakan fade. Satu hook: `usePrefersReducedMotion`.
- Parallax maks. 40–60px. Hover card: scale 1.02 + tilt ringan, border → gradient dalam 200ms. Button primary: fill-sweep dari kiri.
- Default tanpa library animasi (CSS + hook). Bila benar-benar perlu library → tanya, dan hanya satu.

### 9.8 Copy & brand
- Bahasa UI: Indonesia.
- Nama produk di UI: **Konsera**. "Stagelight" = nama design system, bukan nama produk (§15).

---

## 10. Mobile (Expo)

- File di `src/app/` (Expo Router) **hanya** routing tipis yang me-render komponen dari `src/screens/`. **DILARANG** logic layar ditulis di dua tempat.
- Token & warna dari `@konsera/design-tokens`; styling lewat `StyleSheet` (NativeWind hanya bila disetujui).
- Token auth di `expo-secure-store`. **DILARANG** `AsyncStorage` untuk token.
- Scanner: `expo-camera` barcode scanning.
- Mode offline scanner: setiap scan diberi ID lokal (`crypto.randomUUID()`) agar sinkronisasi idempotent; dikirim dengan `is_offline_sync=true`. Library penyimpanan antrean → tanya (§15).
- **DILARANG** import library web-only (`html5-qrcode`, `next/*`, `react-dom`).

---

## 11. Real-time (WebSocket)

- Nama event **hanya** dari konstanta `WS_EVENTS` di `shared-types`: `event:booking:hold`, `event:booking:release`, `event:ticket:sold`, `notification:new`, `checkin:success`. **DILARANG** event baru tanpa update PRD/spec.
- Payload tiap event punya Zod schema; client mem-parse sebelum dipakai.
- Satu koneksi per app (singleton di `lib/socket`). Reconnect dengan backoff.
- Auth via JWT saat handshake; bila lewat query param, **WAJIB** di-mask di log.

---

## 12. Checklist Keamanan Singkat

- [ ] Tidak ada secret/API key di kode atau test
- [ ] Tidak ada token di localStorage / AsyncStorage
- [ ] Tidak ada data kartu disimpan/di-log (PCI didelegasikan ke gateway)
- [ ] Input divalidasi ulang di BE (Zod di FE hanya UX)
- [ ] Query SQL parameterized
- [ ] Konten user di-escape; tidak ada `dangerouslySetInnerHTML`
- [ ] Endpoint baru punya middleware auth + RBAC + rate limit
- [ ] Data sensitif di-mask di log

---

## 13. Testing

- **DILARANG** menghapus, men-skip (`.skip`, `t.Skip`), atau melemahkan assertion test agar hijau. **DILARANG** commit `.only`.
- **DILARANG** snapshot test komponen (pakai Storybook/Chromatic untuk visual).
- Test **WAJIB** ada untuk:
  - BE: hold konkuren (dua user, satu kursi), hold expired → 410, webhook dipanggil dua kali → inventori bertambah sekali, check-in duplikat, window gate, refund < 7 hari, transfer H-1, max 6 tiket, transisi status event.
  - FE: `SeatMap`, `CheckoutSummary`, countdown hold, form checkout (RTL); E2E booking → payment → e-ticket (Playwright); alur scanner (Detox).
- Coverage BE > 80%.
- Integration test BE memakai DB test terisolasi, bukan mock repository.

---

## 14. Definition of Done

Agent **WAJIB** menjalankan ini sebelum menyatakan selesai, dan melaporkan hasilnya:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm knip            # tidak ada file/export/dependency tak terpakai baru
pnpm jscpd           # tidak ada duplikasi baru di atas threshold
bash scripts/check-rules.sh
(cd apps/api && golangci-lint run && go test -race ./...)
```

`scripts/check-rules.sh`:
```bash
#!/usr/bin/env bash
# Gagal bila menemukan pelanggaran aturan desain/arsitektur yang tidak tertangkap lint.
set -uo pipefail
fail=0
violation() { echo "✗ $1"; fail=1; }

rg -n -i --glob '!packages/design-tokens/**' --glob '!**/node_modules/**' \
  -e '#000000\b' -e '#000\b' -e '#ffffff\b' -e '#fff\b' apps packages \
  && violation "Hitam/putih flat (#000/#fff) di luar design-tokens"

rg -n -e '\b(bg|text|border)-(black|white)\b' apps/web/src \
  && violation "Kelas Tailwind black/white — pakai token"

rg -l 'font-logo' apps/web/src | grep -v 'components/brand/Logo.tsx' \
  && violation "font-logo (Ethnocentric) dipakai di luar Logo"

rg -l 'font-signature' apps/web/src | grep -v 'components/features/landing/FanQuote.tsx' \
  && violation "font-signature (Brittany) dipakai di luar FanQuote"

rg -n '\bfetch\(' apps/web/src/components apps/web/src/hooks \
  && violation "fetch() langsung — pakai @konsera/api-client"

rg -n -e "localStorage\.(setItem|getItem)\(['\"](access|refresh|token)" apps/web/src \
  && violation "Token di localStorage"

rg -n 'AsyncStorage\.(setItem|getItem)\(.*(token|Token)' apps/mobile/src \
  && violation "Token di AsyncStorage — pakai expo-secure-store"

exit $fail
```

---

## 15. Ambiguitas PRD yang Sudah Diketahui — TANYA, jangan putuskan sendiri

| # | Masalah | Default sementara (sampai dikonfirmasi) |
|---|---|---|
| 1 | Durasi hold: §3C "10–15 menit" vs §9.1 "10 menit" | 10 menit, dari config server |
| 2 | Hold 10 menit vs masa bayar VA 24 jam / e-wallet 15 menit — kursi dilepas sebelum VA kedaluwarsa? | Tidak ada default — **wajib tanya** sebelum mengerjakan payment |
| 3 | Payment flow: trigger `deduct_inventory_after_payment` **dan** API `UPDATE sold_count` → risiko inventori terpotong dua kali | Bila trigger ada di schema, aplikasi **tidak** update `sold_count` |
| 4 | Socket.io vs native WebSocket | Native WebSocket (lebih alami untuk server Go) |
| 5 | GORM / ent / SQLx | Satu saja; sebaiknya SQLx/pgx (schema SQL-first + golang-migrate) |
| 6 | Midtrans / Xendit / Stripe — mana yang pertama | Tidak ada default — tanya |
| 7 | Nama produk "Konsera" (PRD) vs "Stagelight" (design.md) | UI = Konsera; Stagelight = nama design system |
| 8 | design.md tidak punya warna status (sukses/gagal/peringatan), padahal scanner & form butuh | Tanya; jangan buat hex ad-hoc |
| 9 | Nama tipe `Event` & `Notification` bentrok dengan global DOM | `ConcertEvent`, `AppNotification` |
| 10 | `react-qr-reader` untuk mobile adalah library web | `expo-camera` |
| 11 | Mekanisme QR dinamis 30 detik + validasi offline (TOTP dengan seed di device? fetch token dari server?) | Tidak ada default — tanya, jangan rancang kripto sendiri |
| 12 | Zona waktu untuk aturan H-1, H-3, gate window, refund 7 hari (WIB? zona venue?) | Zona waktu venue — konfirmasi |
| 13 | Enkripsi email/phone at-rest vs login lookup by email (butuh blind index/hash) | Ikuti kolom di schema; jangan buat skema enkripsi sendiri |
| 14 | Prioritas `commission_settings` (global / organizer / event) | Paling spesifik menang: event → organizer → global — konfirmasi |
| 15 | Styling mobile (StyleSheet vs NativeWind) & penyimpanan antrean offline scanner | StyleSheet; storage antrean — tanya |
| 16 | Tipe TS ditulis manual vs di-generate dari OpenAPI | Manual (Zod) di shared-types; generate bila disetujui |

---

## 16. Ringkasan DILARANG (cek cepat)

1. Menambah fitur, endpoint, tabel, event, atau halaman di luar PRD/spec
2. Mendeklarasikan tipe domain/kontrak API di luar `@konsera/shared-types`
3. `any`, `!`, `@ts-ignore`, `enum`, `as` pada data network
4. Menghitung harga/fee/diskon/countdown di FE
5. Hex hardcode, `#000`/`#fff`, arbitrary Tailwind value, warna baru
6. Ethnocentric selain di Logo, Brittany Signature selain di FanQuote
7. Efek landing (spotlight, parallax, tilt, glow) di halaman transaksional; overlay di atas QR
8. `fetch` langsung di komponen; data server di Zustand
9. Token di localStorage/AsyncStorage; `dangerouslySetInnerHTML` untuk konten user
10. Dependency di luar §3 tanpa izin; dua library untuk fungsi yang sama
11. Mock/stub/TODO di kode produksi; kode yang di-comment-out
12. SQL string concat; `AutoMigrate`; `fmt.Print` di Go
13. Menghapus/skip test agar hijau
14. Refactor/reformat di luar scope task