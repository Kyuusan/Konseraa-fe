# Design System — "Stagelight" Landing Page
Landing page aplikasi tiket konser (global & domestik) — futuristic, modern clean, dark-first.

> **Cara pakai di Google Stitch:** copy tiap section (## Section — ...) sebagai satu prompt terpisah kalau mau generate per-layar, atau paste seluruh file sekaligus untuk generate keseluruhan flow. Token warna & font di bagian atas berlaku untuk semua section.

---

## 1. Konsep & Mood

**Subjek:** platform pencarian & pembelian tiket konser — dari stadium show artis global sampai gigs domestik di venue lokal.
**Mood:** malam sebelum konser dimulai — lampu panggung baru menyala, crowd belum penuh, ada rasa antisipasi. Bukan glossy/glassy, bukan neon berlebihan — **clean, presisi, sedikit tegang**.
**Signature motif:** *Spotlight Sweep* — glow gradient pink→lime yang bergerak halus mengikuti scroll, seperti lampu rig panggung yang menyapu perlahan. Dipadukan dengan **ticket-stub notch** (sudut kartu yang "disobek" seperti tiket fisik) sebagai elemen struktural berulang di semua card.

---

## 2. Design Tokens

### Warna
Hitam **tidak** pakai `#000000` flat — pakai near-black dengan sedikit undertone biru-ungu supaya terasa lebih "premium stage floor", bukan hitam mati.

```css
--color-bg-base:      #0B0B0E;  /* Stage Black — background utama */
--color-bg-surface:   #16151C;  /* Backline Charcoal — card/section surface */
--color-bg-surface-2: #1E1D26;  /* elevated surface, modal/nav sticky */
--color-text-primary: #F5F3EF;  /* Marquee White — bukan #FFFFFF murni */
--color-text-muted:   #8D8A99;  /* Soundcheck Grey — body sekunder, caption */
--color-accent-pink:  #FF3DA6;  /* Gel Pink — stage-light gel magenta */
--color-accent-lime:  #C6FF3D;  /* Encore Lime — glow-stick lime */
--color-border:       rgba(245,243,239,0.08); /* hairline divider di atas dark bg */
```

### Glow Gradient (dipakai tipis, jangan solid)
```css
--glow-pink: radial-gradient(circle, rgba(255,61,166,0.35), transparent 70%);
--glow-lime: radial-gradient(circle, rgba(198,255,61,0.28), transparent 70%);
--glow-sweep: linear-gradient(120deg, rgba(255,61,166,0.25), rgba(198,255,61,0.18));
```
Aturan pakai: blur besar (80–120px), opacity rendah (20–35%), posisi asimetris di belakang konten — tidak pernah full-bleed rata di seluruh section.

### Tipografi

| Fungsi | Font | Ukuran (desktop) | Catatan |
|---|---|---|---|
| Logo | **Ethnocentric** | fixed, wordmark only | huruf besar semua, letter-spacing lebar, HANYA di logo — jangan dipakai di heading lain |
| Heading (H1) | **Author**, bold | 64–96px | leading ketat (1.05), satu kata di-highlight pakai gradient text pink→lime |
| Heading (H2/H3) | **Author**, semibold | 32–48px / 20–24px | |
| Body | **Manrope**, regular/medium | 16–18px | line-height 1.6, warna `--color-text-primary` atau `--color-text-muted` |
| Eyebrow/Label/Caption | **Manrope**, semibold uppercase | 12–13px | letter-spacing wide, warna muted |
| Quote / momen signature | **Brittany Signature** | 28–40px | **hanya dipakai sekali** — di testimoni fans. Jangan dipakai di CTA/body |

### Layout
- Grid 12 kolom, max-width container `1280px`, gutter `24px`
- Ritme vertikal antar section: `96–128px` desktop, `64px` mobile
- Radius kartu: `20px`, dengan **1 sudut notch** (biasanya kanan-atas) meniru sobekan tiket
- Divider antar bagian tiket: dashed line + lingkaran kecil di kiri-kanan (perforasi tiket)
- Button primary: pill radius `999px`

---

## 3. Struktur Halaman (Wireframe)

```
┌──────────────────────────────────────────────────────┐
│ [ETHNOCENTRIC LOGO]   Jelajahi  Global  Domestik      │  Navbar sticky,
│                        Tentang        [Cari Tiket →]  │  bg blur saat scroll
├──────────────────────────────────────────────────────┤
│                                                        │
│   Temukan panggung berikutnya.                        │  HERO
│   Dari [arena dunia] sampai [gigs lokal].              │  - H1 Author, 1 kata
│                                                        │    di-gradient
│   [subcopy Manrope 1-2 baris]                          │  - 2 CTA (primary
│   [Cari Konser]   [Lihat Line-up]                      │    lime, secondary
│                                                        │    outline)
│   ░░ foto crowd + spotlight, parallax 0.4x ░░          │  - glow orb ambient
└──────────────────────────────────────────────────────┘
──── ARTIS · KOTA · TANGGAL · ARTIS · KOTA · TANGGAL ──── (marquee ticker,
                                                             auto-scroll,
                                                             pause on hover)
┌──────────────────────────────────────────────────────┐
│ Konser Trending                          [Lihat semua]│  FEATURED
│ [tiket-card] [tiket-card] [tiket-card] →scroll        │  - scroll horizontal
│  img atas, perforasi, artis/venue/tanggal/harga bawah  │  - notch corner
│  hover: tilt 2° + border glow pink/lime                │
├──────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐         │  GLOBAL vs DOMESTIK
│  │  KONSER GLOBAL     │  │  KONSER DOMESTIK   │         │  - 2 panel besar
│  │  128 event · →     │  │  64 event · →      │         │  - parallax beda
│  └───────────────────┘  └───────────────────┘         │    speed dari teks
├──────────────────────────────────────────────────────┤
│  01  Cari & pilih konser                               │  CARA KERJA
│  02  Pilih kursi & bayar                                │  - 3 step, numbering
│  03  Tunjukkan e-tiket, nikmati                          │    valid (proses nyata)
├──────────────────────────────────────────────────────┤
│         " kutipan singkat dari fans "                  │  TESTIMONI
│              — Nama, kota                              │  - Brittany Signature
│                                                        │  - satu-satunya
│                                                        │    momen script font
├──────────────────────────────────────────────────────┤
│   Jangan sampai kehabisan tiket.                        │  CTA PENUTUP
│   [email input]  [Ingatkan saya]                        │  - glow sweep paling
│   ░░ dual glow orb pink+lime, paling terang di page ░░  │    terang di halaman
├──────────────────────────────────────────────────────┤
│ [logo] Jelajahi Global Domestik Tentang   [sosial]      │  FOOTER
│ hairline border top · © copyright                       │
└──────────────────────────────────────────────────────┘
```

---

## 4. Motion & Scroll Interaction

- **Spotlight Sweep (signature):** glow orb pink→lime, blur besar, bergerak diagonal mengikuti scroll position sepanjang halaman — kecepatan lambat, seperti rig lampu panggung yang bergeser. Selalu di belakang konten, opacity rendah.
- **Reveal on scroll:** section fade + translateY(24px→0) saat masuk viewport, stagger antar child ±80ms. Jangan pakai efek besar/berlebihan.
- **Parallax:** foto background konser bergerak di 0.4x kecepatan scroll vs konten di 1x. Batasi pergeseran maksimal ~40–60px — parallax tipis, bukan dramatis.
- **Marquee ticker:** infinite scroll linear, pause saat hover.
- **Ticket card hover:** scale 1.02 + tilt ringan mengikuti posisi cursor, border berubah dari hairline abu-abu jadi gradient pink/lime dalam 200ms.
- **Button primary hover:** fill-sweep (warna lime "menyapu" dari kiri), bukan sekadar opacity fade.
- **Reduced motion:** matikan drift orb, parallax offset, dan tilt cursor; sisakan fade sederhana saja.

---

## 5. Arahan Foto (Dummy Image)

Semua foto diberi treatment warna senada: shadow sedikit ditarik ke arah hitam-kebiruan, highlight sedikit ditarik ke pink/lime — supaya foto terasa "native" ke palette, bukan stok foto tempelan.

- **Hero:** wide shot siluet crowd, tangan terangkat menghadap panggung, low-key lighting, rim light pink/lime dari lampu panggung, sedikit grain.
- **Featured cards (campur global & domestik):** arena show internasional dengan pyrotechnic/lighting rig besar; berdampingan dengan gigs domestik di venue kecil, lampu panggung hangat, nuansa lebih intim.
- **Panel Global:** aerial/wide shot stadium show ikonik.
- **Panel Domestik:** venue lokal/indoor arena, nuansa lebih dekat & personal.

---

## 6. Yang Dihindari

- Hitam flat `#000000` dan putih flat `#FFFFFF`.
- Glow yang solid/tebal atau full-bleed — harus tetap tipis dan asimetris.
- Font Brittany Signature dipakai di lebih dari satu tempat (hanya testimoni).
- Parallax/animasi berlebihan yang membuat halaman terasa berat atau "generic AI landing page".
- Numbering/label dekoratif yang tidak merepresentasikan urutan nyata (kecuali di "Cara Kerja" yang memang proses berurutan).
