# DESIGN — IT Club SMKN 1 Surabaya

**Version**: 2.0.0
**Last Updated**: 2026-10-10
**Design Language**: Warm Editorial SaaS
**Reference**: Lima AI landing (warm off-white, rounded photo panels, floating UI cards, asterisk mark, dark footer with giant wordmark)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing, Radius & Border Scale](#4-spacing-radius--border-scale)
5. [Layout & Grid](#5-layout--grid)
6. [Signature Components (Motifs)](#6-signature-components-motifs)
7. [Motion & Timing](#7-motion--timing)
8. [Imagery & Photography Direction](#8-imagery--photography-direction)
9. [Page Blueprint — Landing (`apps/web`)](#9-page-blueprint--landing-appsweb)
10. [Page Blueprint — Dashboard (`apps/dashboard`)](#10-page-blueprint--dashboard-appsdashboard)
11. [Bilingual Copy Rules (ID/EN)](#11-bilingual-copy-rules-iden)
12. [Accessibility](#12-accessibility)
13. [Do / Don't Checklist](#13-do--dont-checklist)

---

## 1. Design Principles

### 1.1 The Five Rules

**RULE 1 — Photo panels carry the page.**
Large rounded image panels are the primary visual carrier. Text sits beside or under them, never over a busy photo without a white card in between. Every major section pairs a photo panel with floating white UI cards.

**RULE 2 — Warm off-white, white cards, near-black type.**
The page background is warm off-white (`#F3F3F1`). Cards are pure white. Type is near-black. Nothing else. Color comes from the photography, not from decoration.

**RULE 3 — Headings are confident, not airy.**
Display type is **semi-bold (600)**, tight tracking, sentence case. Large and left-aligned or centered depending on section. This is not a whisper-light editorial treatment — it's a confident product page.

**RULE 4 — Rounded is the default.**
Image panels `24px`, cards `16px`, chips and buttons `8px`. The rounded softness is what makes the page feel approachable rather than corporate.

**RULE 5 — Structure is shown through eyebrow labels, numbers, and hairlines.**
`●` and `✳` prefixes on eyebrow labels, `01`–`04` on feature cards, thin hairline dividers on accordion rows. No borders around sections. No shadows unless the element genuinely floats (only white cards sitting over a photo).

### 1.2 Anti-Patterns (Banned)

| Banned | Why | Replacement |
|--------|-----|-------------|
| Drop shadows on floating cards without photo context | Fake depth | Only white cards over a photo get shadow |
| Purple/blue gradients | AI slop | Photography + solid black buttons |
| Bold marketing-slop CTAs ("Get Started Free") | Generic | Concrete verbs: "Masuk Dashboard", "Gabung Ekskul" |
| Centered everything | Lazy layout | Center only sections 3 and 6 (per blueprint) |
| Icon-in-circle feature grids | Template default | Photo + number feature cards |
| Gradient text | Gimmick | Solid color |
| Emoji as icons | Unprofessional | Asterisk glyph + Lucide line icons |
| Dark mode by default | Not in reference | Off-white page, dark footer only |
| More than 2 font families | Amateur | Inter + JetBrains Mono (numbers/data only) |

### 1.3 The "Matches the Reference" Test

1. Does the page read warm off-white with white cards?
2. Is every major section a photo panel + text, not text + icon?
3. Are eyebrows prefixed with `●` or `✳`?
4. Is the footer near-black with an oversized wordmark?
5. Can you remove one card and it still works? Then remove it.

---

## 2. Color System

### 2.1 Core Tokens

```css
/* ---------- PAGE ---------- */
--color-bg:            #F3F3F1;  /* warm off-white — page background */
--color-bg-alt:        #ECECE9;  /* alternate band (subtle) */
--color-surface:       #FFFFFF;  /* cards, chips, floating panels */
--color-hairline:      #E4E4E1;  /* 1px borders, dividers */
--color-hairline-soft: #EDEDEA;  /* internal dividers inside cards */

/* ---------- TEXT ---------- */
--color-text-1: #111111;  /* headings, primary */
--color-text-2: #5C5C5C;  /* body, secondary */
--color-text-3: #8A8A8A;  /* eyebrow, meta, muted */

/* ---------- DARK (footer only) ---------- */
--color-bg-dark:     #0E0E0E;
--color-surface-dark:#1A1A1A;
--color-text-1-dark: #FAFAFA;
--color-text-2-dark: #A0A0A0;
--color-text-3-dark: #6E6E6E;
--color-hairline-dark:#2A2A2A;

/* ---------- ACCENT ---------- */
--color-accent:      #111111;  /* buttons are near-black, not colored */
--color-accent-hover:#2E2E2E;
--color-brand:       #7C8C6B;  /* sage green — comes from the photography */
--color-brand-soft:  rgba(124,140,107,0.14);

/* ---------- SEMANTIC (dots / tags only) ---------- */
--color-success: #3F7D5A;
--color-warn:    #B8860B;
--color-danger:  #B3261E;
```

### 2.2 Color Usage Rules

- **Buttons are near-black** (`#111111`) with white text, or white with `1px` border and black text. Never a saturated brand color.
- **Sage green** appears only as photo toning and as small tag/chip backgrounds — never as a primary button.
- **Semantic colors** appear only as a `6px` dot before a status label. Never as a filled badge.
- **Shadow** is allowed only on white cards floating above a photo panel: `0 12px 40px rgba(0,0,0,0.10)`. Never on cards sitting on the page background.

### 2.3 Contrast

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `#111111` | `#F3F3F1` | 16.4:1 | AAA |
| `#5C5C5C` | `#F3F3F1` | 6.3:1 | AA |
| `#8A8A8A` | `#F3F3F1` | 3.4:1 | AA Large only — eyebrow/labels at ≥11px weight 500 |
| `#FFFFFF` on `#111111` | — | 17.4:1 | AAA |
| `#A0A0A0` | `#0E0E0E` | 7.2:1 | AA |

---

## 3. Typography

### 3.1 Families

| Role | Family | Fallback | Use |
|------|--------|----------|-----|
| Display / Body | **Inter** | `system-ui, sans-serif` | Everything except numbers |
| Data | **JetBrains Mono** | `ui-monospace, monospace` | `01`–`04`, dates, counts, points |

### 3.2 Type Scale

```css
--text-display-1: clamp(2.5rem, 5vw, 4rem);   /* hero H1 */
--text-display-2: clamp(2rem, 3.5vw, 3rem);   /* section H2 */
--text-display-3: clamp(1.5rem, 2vw, 1.75rem);/* card H3 */
--text-body-lg:   1.0625rem;                   /* lead paragraph */
--text-body:      0.9375rem;                   /* default */
--text-body-sm:   0.875rem;                    /* meta, captions */
--text-label:     0.6875rem;                   /* eyebrow (11px) */
```

### 3.3 Weight & Tracking

| Element | Weight | Tracking | Line-height |
|---------|--------|----------|-------------|
| H1 | 600 | `-0.02em` | 1.08 |
| H2 | 600 | `-0.015em` | 1.12 |
| H3 | 600 | `-0.01em` | 1.3 |
| Lead paragraph | 400 | `0` | 1.6 |
| Body | 400 | `0` | 1.65 |
| Eyebrow (uppercase) | 500 | `0.14em` | 1.2 |
| Button (uppercase) | 500 | `0.1em` | 1 |
| Mono data | 500 | `0` | 1.3 |

**Rule:** Headings are **600**, never 800+. Eyebrows and buttons are always uppercase with wide tracking.

---

## 4. Spacing, Radius & Border Scale

### 4.1 Spacing

```css
--space-1: 4px;   --space-5: 24px;
--space-2: 8px;   --space-6: 32px;
--space-3: 12px;  --space-7: 48px;
--space-4: 16px;  --space-8: 64px;
                    --space-9: 96px;
                    --space-10: 128px;
```

### 4.2 Section Padding

```css
--section-pad-y: clamp(72px, 9vw, 140px);
--section-pad-x: clamp(20px, 5vw, 72px);
```

### 4.3 Radius

```css
--radius-photo: 24px;  /* large image panels */
--radius-card:  16px;  /* feature cards, floating UI cards, testimonial cards */
--radius-chip:  8px;   /* buttons, chips, inputs */
--radius-full:  9999px;/* avatars */
```

**This overrides the previous 2px rule.** The reference is soft and rounded.

### 4.4 Borders & Shadows

```css
--border: 1px solid var(--color-hairline);
--shadow-float: 0 12px 40px rgba(0,0,0,0.10); /* cards over photo ONLY */
--shadow-photo: 0 24px 60px rgba(0,0,0,0.08); /* large photo panel */
```

---

## 5. Layout & Grid

### 5.1 Container

```css
.container       { max-width: 1240px; margin-inline: auto; padding-inline: var(--section-pad-x); }
.container-wide  { max-width: 1440px; }   /* full-bleed photo bands */
.container-narrow{ max-width: 720px; }    /* centered eyebrow sections */
```

### 5.2 Recipes

| Layout | Recipe |
|--------|--------|
| Hero split | `5 / 7` (text / photo) |
| Platform section | `5 / 7` (photo / accordion) |
| Feature grid | 2×2 equal cards |
| Section header row | `7 / 5` (title / description+button) |
| Footer | `5 / 7` (newsletter / link columns) |

### 5.3 Breakpoints

| Name | Min-width | Behavior |
|------|-----------|----------|
| `xs` | 0 | Single column, photo panels full-width, nav collapses to menu |
| `sm` | 640px | Feature cards 1 col → 2 col |
| `md` | 768px | Two-column layouts activate, accordion beside photo |
| `lg` | 1024px | Full grid, all columns, nav links visible |
| `xl` | 1280px | Content caps at 1240px |

---

## 6. Signature Components (Motifs)

### 6.1 `AsteriskMark`

The brand mark. `✳` — a six-pointed asterisk glyph.

```jsx
<span className="inline-block size-4 leading-none align-middle">✳</span>
```

Used: next to logo in nav, as the center of the isometric graphic, oversized in the footer.

### 6.2 `Eyebrow`

Section label with a leading dot or asterisk.

```
●  DIBUAT UNTUK EKSKUL            (dot version — centered sections)
✳  PORTAL TUGAS                   (asterisk version — hero, left aligned)
```

**Spec:** `11px`, weight 500, uppercase, tracking `0.14em`, color `--color-text-3`. Prefix glyph is `●` (black) or `✳` (brand or black), separated by `8px`.

Centered sections use `●` + centered. Left-aligned sections use `✳`.

### 6.3 `Button`

Two variants, radius `8px`, uppercase, tracking `0.1em`, `12px/500`.

| Variant | Style |
|---------|-------|
| `solid` | bg `#111111`, text white, hover bg `#2E2E2E` |
| `outline` | bg transparent, `1px` border `#E4E4E1` (light) or `#2A2A2A` (dark), text near-black/white |

Height `44px`, padding `0 20px`. On the dark footer, `solid` becomes white-on-black inverted (white bg, black text).

### 6.4 `PhotoPanel`

Large rounded image container. Radius `24px`, `overflow:hidden`, `--shadow-photo`.

```jsx
<div className="relative overflow-hidden rounded-[24px] shadow-photo">
  <Image className="aspect-[4/3] object-cover" />
</div>
```

Always paired with 1–3 floating cards (see 6.5).

### 6.5 `FloatingCard`

White card that sits over a `PhotoPanel`. Radius `16px`, bg white, `--shadow-float`.

Content = simplified UI snippet (title, rows with checkbox/tag/avatar, progress). Position with absolute + offset. Max 3 per panel. Each offset differently (e.g. top-right, bottom-left, middle-right).

### 6.6 `ToolChip`

Row item showing an integration/tool.

```
┌──────────────────┐
│  ◆  GITHUB        │
└──────────────────┘
```

White bg, `1px` hairline border, radius `8px`, padding `10px 14px`, icon + label in `13px/500`. Used in the hero integration row.

### 6.7 `FeatureCard`

Card with image, text, and a mono number.

```
┌────────────────────────────────────────┐
│                                        │
│   (rounded photo/screenshot)           │
│                                        │
├────────────────────────────────────────┤
│  Pengumpulan Tugas                01   │
│  Upload file & link, batas waktu jelas │
│  ─────────────────────────────────     │
│  Kumpulkan file zip atau link GitHub…  │
└────────────────────────────────────────┘
```

- Card: white, radius `16px`, `1px` hairline border, padding `20px`.
- Image: radius `12px`, aspect `16/10`, at top.
- Title row: `16px/600` left, mono number `01` right (`13px`, `--color-text-3`).
- Subtitle: `13px`, `--color-text-2`.
- Divider `1px`, then paragraph `13px/1.6`, `--color-text-2`.
- Four corner `+` marks at `12px` inset (only on this card — matches reference).

### 6.8 `Accordion`

Vertical list of rows with `+` / `−` toggles.

- Each row: `1px` hairline top border (last row also bottom).
- Title `16px/600` left, `+`/`−` icon right (`20px`).
- Expanded body: paragraph + 4 checkmark bullets in 2×2 grid, `13px`.
- Only one row open at a time. Open row shows `−`.
- Padding `24px 0`.

### 6.9 `TestimonialCard`

White card over a full-bleed photo band.

- Radius `16px`, `--shadow-float`, padding `24px`.
- Top: `40px` circular avatar + name (`14px/600`) + role (`12px`, `--color-text-3`).
- Quote: `14px/1.6`, `--color-text-2`, 4–5 lines.
- Cards sit in a horizontal row overlapping the photo band; leftmost card is partially cut off at the viewport edge (implies a marquee/carousel).

### 6.10 `IntegrationOrb` (isometric graphic)

Section 6 graphic: scattered rounded-square tool tiles in isometric 3D, with a central green box carrying the `✳` asterisk. Built with CSS 3D transforms or a static PNG/WebP. Falls back to a rounded photo panel if assets unavailable.

### 6.11 `GiantWordmark`

Footer signature: `✳` + huge display text.

```jsx
<div className="flex items-center gap-4">
  <AsteriskMark className="text-[8rem]" />
  <span className="text-[8rem] font-bold tracking-[-0.04em]">IT CLUB</span>
</div>
```

Color `--color-text-1-dark`, clipped at the bottom edge of the footer.

### 6.12 `NewsletterField`

Dark input + square arrow button inside the footer. Radius `8px`, bg `#1A1A1A`, border `#2A2A2A`, placeholder `--color-text-3-dark`. Button = solid white square with `→`.

---

## 7. Motion & Timing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast: 200ms;   /* hover, focus */
--dur-base: 500ms;   /* enter */
--dur-slow: 800ms;   /* reveal, image scale */
```

| Motion | Spec |
|--------|------|
| Scroll reveal | `opacity 0→1`, `y 16→0`, `500ms --ease-out`, stagger `70ms`, `once` |
| Floating card entrance | `y 24→0` + `scale .98→1`, `600ms`, delayed `200ms` after photo |
| Photo hover | `scale 1.02`, `800ms` |
| Accordion | `height` auto, `400ms ease-out`; `+` rotates `45deg` to `×` |
| Testimonial marquee | continuous `translateX`, `40s linear infinite`, pause on hover |
| Button hover | bg shift + `translateY(-1px)`, `200ms` |
| Asterisk (footer/isometric) | slow `rotate 20s linear infinite` on the mark only |

`prefers-reduced-motion: reduce` disables marquee, rotation, and scale; keeps opacity-only reveals.

---

## 8. Imagery & Photography Direction

**All photography is nature/landscape with a sage-green grade** — misty forests, foliage, campus greenery, students working outdoors or in a lab. This is what gives the reference its warmth.

```css
.photo-grade {
  filter: saturate(0.9) contrast(1.02);
}
```

### Rules

- Photos are always inside a `PhotoPanel` (radius `24px`).
- Never text directly over a photo — always a white `FloatingCard`.
- For IT Club: lab rooms, keyboards/screens, green campus, hardware, students collaborating. Muted green/neutral grade.
- **Before real photos exist**: use a soft green→neutral gradient block at the same radius, with a centered `● FOTO` eyebrow. Never stock URLs, never emoji placeholders.

### Screenshots

Feature cards show simplified UI mockups. Build them as real markup inside the card (mini tables, rows, tags) rather than images — crisper and self-contained.

---

## 9. Page Blueprint — Landing (`apps/web`)

Single scrolling page, warm off-white throughout, dark footer at the end.

| # | Section | Layout | Band |
|---|---------|--------|------|
| 0 | Nav | sticky, logo left, links + button right | light |
| 1 | Hero | 5/7 split: text + tools row / photo panel w/ floating cards | light |
| 2 | Platform | centered header, then 5/7: photo panel / accordion | light |
| 3 | Features | header row 7/5, then 2×2 feature cards | light |
| 4 | Testimonials | header row 7/5, then full-bleed photo + 3 cards | light |
| 5 | Integrations | centered header + button, isometric graphic | light |
| 6 | Footer | dark: newsletter left, 4 link columns, giant wordmark | dark |

### 9.1 Nav

```
✳ IT CLUB                      BERANDA  TENTANG  FITUR  JADWAL   [ MASUK DASHBOARD ]
```
Sticky, bg `--color-bg` (solid, no blur), `1px` bottom hairline after scroll. Height `72px`. Mobile: logo + hamburger, links in a dropdown panel.

### 9.2 Hero

```
✳ PORTAL TUGAS IT CLUB

Tugas, Absensi, dan Prestasi —         ┌─────────────────────────────┐
Semua di Satu Tempat.                  │                             │
                                       │   ( PhotoPanel, green lab   │
│ Kumpulkan tugas, pantau nilai,       │    / campus photo, 4:3 )    │
│ dan lihat peringkat kontribusi.      │                             │
│ Portal resmi ekskul IT Club SMKN 1   │   ┌─────────────────────┐   │
│ Surabaya.                            │   │ Tugas React Native  │   │
│                                      │   │ ● Tepat Waktu   ✓   │   │
│ [ MASUK DASHBOARD ]  [ GABUNG ]      │   └─────────────────────┘   │
│                                      │        ┌───────────────┐    │
│ Terintegrasi dengan                  │        │ Absensi #12 ✓ │    │
│ ┌ GITHUB ┐ ┌ FIGMA ┐ ┌ DRIVE ┐       │        └───────────────┘    │
└──────────────────────────────────────┴─────────────────────────────┘
```

- H1: `--text-display-1`, 600, left-aligned, max-width `560px`.
- 2 buttons side by side: `solid` + `outline`.
- Below: label `Terintegrasi dengan` + 4 `ToolChip`s wrapping.
- Right: `PhotoPanel` with 2–3 `FloatingCard`s overlapping its edges.

### 9.3 Platform Section (centered header + 2-col)

- Eyebrow `● DIBUAT UNTUK EKSKUL`, centered.
- H2 centered: `Satu Portal. Semua Kebutuhan Ekskul.`
- Centered lead paragraph, max-width `640px`.
- Below, two columns:
  - **Left**: `PhotoPanel` with floating tool cards (`GITHUB`, `FIGMA`, `GOOGLE DRIVE`) and the `✳` mark.
  - **Right**: `Accordion` with 6 rows — Dashboard Anggota, Pengumpulan Tugas, Absensi Pertemuan, Rekap & Rangking, Notifikasi, Pengumuman & Galeri. Second row open by default.

### 9.4 Features Section

- Header row: left = eyebrow `● APA SAJA DI DALAMNYA` + H2 `Tenang, Semua Urusan Tugas Terkelola.`; right = lead paragraph + `solid` button `LIHAT SEMUA FITUR`.
- 2×2 grid of `FeatureCard`:
  01 **Pengumpulan Tugas** — Upload file & link, batas waktu jelas
  02 **Penilaian & Umpan Balik** — Nilai dan catatan dari pengurus
  03 **Absensi Pertemuan** — Check-in hadir setiap sesi
  04 **Rangking Anggota** — Poin dari ketepatan dan kehadiran

### 9.5 Testimonials Section

- Header row: left = eyebrow `● DARI ANGGOTA` + H2 `Kerja sama jadi jelas saat semua tahu harus berbuat apa.`; right = lead + `solid` button `GABUNG SEKARANG`.
- Full-bleed rounded photo band (height ~420px, radius `24px`, extends to container edges).
- 3 `TestimonialCard`s absolutely positioned over the band, horizontally scrollable/marquee; leftmost partially cut at viewport edge.
- Each: avatar + name + role (`Ketua`, `Koordinator Divisi`, `Anggota`).

### 9.6 Integrations Section (centered)

- Eyebrow `● TERHUBUNG`, centered.
- H2 centered: `Alat yang sudah kamu pakai, nyambung semua.`
- Lead paragraph centered.
- `solid` button `HUBUNGKAN AKUN`.
- `IntegrationOrb` graphic below (full width).

### 9.7 Footer (dark)

```
● DIBANGUN UNTUK SMKN 1         Navigasi    Produk       Sumber Daya   Lainnya
                                Beranda      Portal       Panduan       Instagram
Mulai dari tugas pertama.       Tentang      Absensi      FAQ           WhatsApp
Kirim email kamu untuk           Fitur        Rangking     Kontak        GitHub
dapatkan akses awal.            Jadwal       Pengumuman
┌ [ email____________ ] [→] ─────────────────────────────────────────────
✳                                                          IT CLUB
© 2026 IT CLUB SMKN 1 SURABAYA                Kebijakan Privasi  Ketentuan
```

- Band bg `--color-bg-dark`.
- Left: eyebrow + H2 `Mulai dari tugas pertama.` + lead + `NewsletterField`.
- Right: 4 columns of links, `11px` uppercase, tracking `0.14em`.
- Bottom: `GiantWordmark` (`✳ IT CLUB`), clipped.
- Bottom bar: copyright left, two policy links right, `1px` top hairline.

---

## 10. Page Blueprint — Dashboard (`apps/dashboard`)

The dashboard uses the **same warm off-white palette** as the landing page — not a dark shell. Dark appears only in the footer band and in `solid` buttons.

### 10.1 Shell

```
┌──────────────────────────────────────────────────────────────┐
│ ✳ IT CLUB    BERANDA · TUGAS · RIWAYAT · PERINGKAT  [🔔] (◍)│ ← bg #F3F3F1, hairline bottom
├──────────────────────────────────────────────────────────────┤
│  Content on #F3F3F1, cards white, radius 16px                │
└──────────────────────────────────────────────────────────────┘
```

- Top bar `72px`, solid bg, `1px` bottom hairline. Mobile: hamburger + drawer.
- Content max-width `1240px`, padding `48px 0`.
- All cards: white, radius `16px`, `1px` hairline border, no shadow.
- Only cards over a photo get shadow (admin overview may use a `PhotoPanel` hero).

### 10.2 Member Pages

| Route | Content |
|-------|---------|
| `/dashboard` | Greeting + 3 `StatCard` (Poin, Peringkat, Tingkat Kumpul) + next deadline + recent submissions |
| `/assignments` | Filter tabs + `FeatureCard`-style list with status dots |
| `/assignments/[id]` | Detail + `PhotoPanel`-free submit form (upload dropzone + link input) |
| `/submissions` | Table rows with status dots and scores |
| `/leaderboard` | Ranked list, avatar + name + points |
| `/notifications` | Hairline list, unread dot |
| `/settings` | Password form + language toggle |

### 10.3 Admin Pages

| Route | Content |
|-------|---------|
| `/admin` | KPI row + activity table |
| `/admin/users` | User table + create/edit modal (radius `16px`) |
| `/admin/assignments` | Assignment CRUD |
| `/admin/categories` | Inline CRUD list |
| `/admin/grading` | Submission queue + grading panel |
| `/admin/attendance` | Meeting selector + member checklist |
| `/admin/announcements` | Announcement CRUD |
| `/admin/gallery` | Upload grid |
| `/admin/reports` | Stats + CSV export |
| `/admin/settings` | Site config + point weights |

---

## 11. Bilingual Copy Rules (ID/EN)

| Rule | Detail |
|------|--------|
| Default locale | `id` (no URL prefix) |
| English | `?lang=en` or cookie `NEXT_LOCALE=en` |
| Persistence | Cookie `NEXT_LOCALE`, fallback `Accept-Language` |
| Toggle | Nav: `ID / EN`, active one in `--color-text-1` |
| Dates | `id` → `8 Oktober 2026`; `en` → `8 October 2026` |
| Numbers | `1,450` both locales |

**Eyebrow copy style:** uppercase, noun-first, ≤3 words. No sentences.
`● DIBUAT UNTUK EKSKUL` / `● BUILT FOR THE CLUB`

**Tone:** ID uses `kamu` for members, `Anda` for public. EN neutral-professional. No emoji, no exclamation marks, no filler like "Selamat datang di...".

---

## 12. Accessibility

- Body text ≥ 4.5:1 (see §2.3). Eyebrows ≥ 11px / weight 500.
- Focus: `2px` solid `#111111` outline with `2px` offset on light; `#FAFAFA` on dark.
- Tap targets ≥ 44×44px.
- Real `<button>`/`<a>`/`<table>`; icons `aria-hidden`, icon-only controls get `aria-label`.
- Accordion: `aria-expanded`, `aria-controls` on each row.
- `prefers-reduced-motion` respected (§7).
- Status never color-only — pair dot with text label.
- Every input has a `<label>`; errors linked via `aria-describedby`.

---

## 13. Do / Don't Checklist

### Do
- [ ] Warm off-white page, white cards, near-black type.
- [ ] Every major section pairs a rounded photo panel with floating white cards.
- [ ] Eyebrows prefixed with `●` (centered) or `✳` (left).
- [ ] Radius: `24px` photo / `16px` card / `8px` chip & button.
- [ ] Headings weight `600`, tight tracking, never 800+.
- [ ] Near-black solid buttons, outline secondary.
- [ ] Mono numbers `01`–`04` on feature cards.
- [ ] Dark footer with oversized `✳ IT CLUB` wordmark.
- [ ] Shadow only on cards floating above a photo.

### Don't
- [ ] No gradients on buttons or text.
- [ ] No purple/violet.
- [ ] No emoji icons.
- [ ] No filled color badges for status.
- [ ] No drop shadows on cards resting on the page background.
- [ ] No bold 800-weight headings.
- [ ] No dark-mode-by-default pages.
- [ ] No stock photo URLs.
- [ ] No more than 2 font families.

---

**Design system owner:** Admin
**Token source of truth:** `packages/config/src/theme.ts` + `apps/web/tailwind.config.ts`
**Review trigger:** any new page or component before merge.
