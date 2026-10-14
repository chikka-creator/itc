# PLAN — IT Club Submission Portal

**Project**: Portal Tugas & Kegiatan IT Club — SMK Negeri 1 Surabaya
**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Owner**: Admin (Founder)
**Status**: 📋 Planning

---

## 1. Visi & Problem Statement

### Problem
Anggota IT Club SMKN 1 Surabaya membutuhkan platform terpusat untuk:
- Mengumpulkan tugas yang diberikan setiap pertemuan ekskul
- Melihat deadline dan status penerimaan tugas
- Mengetahui nilai tugas yang sudah dinilai
- Melihat ranking kontribusi antar-anggota

Saat ini, pengumpulan tugas tersebar di berbagai platform (Google Drive, WhatsApp, email), menyulitkan admin melacak siapa sudah/kurang mengumpulkan.

### Solution
Satu portal web dengan dua aplikasi terpisah:
1. **Public Landing** (`apps/web`) — profil IT Club, jadwal, pengumuman, galeri, leaderboard publik
2. **Dashboard** (`apps/dashboard`) — login, submission tugas, penilaian, absensi, manajemen

### Success Metrics
| Metric | Target |
|--------|--------|
| Anggota terdaftar | 100% anggota ekskul punya akun |
| Tugas terkumpul per minggu | ≥ 90% anggota submit tepat waktu |
| Admin input nilai | ≤ 3 hari setelah deadline |
| Leaderboard updated | Real-time |

---

## 2. Scope

### 2.1 In Scope (v1.0)

#### Public Landing Page (`apps/web`)
- ✅ Hero: tagline + CTA "Join IT Club" / "Masuk Dashboard"
- ✅ Tentang IT Club (sejarah, visi, divisi)
- ✅ Jadwal pertemuan (preview 3 jadwal terdekat)
- ✅ Pengumuman terbaru (3 terbaru)
- ✅ Gallery foto kegiatan (grid 6 foto)
- ✅ Leaderboard publik (top 10, nama + poin saja)
- ✅ CTA: "Gabung Ekskul" dengan kontak admin
- ✅ Footer: kontak, link, credit

#### Dashboard App (`apps/dashboard`)
**Member Role:**
- ✅ Login (username + password)
- ✅ Dashboard: ringkasan tugas (belum/terkumpul/terlambat), poin, rank
- ✅ Daftar tugas aktif + detail tugas
- ✅ Submit tugas: upload file (≤100MB) + link URL (opsional)
- ✅ Edit submission sebelum deadline
- ✅ Lihat status: Pending / Accepted / Rejected + feedback
- ✅ Lihat nilai tugas
- ✅ Lihat riwayat submission
- ✅ Notifikasi in-app (tugas baru, deadline besok, nilai keluar)
- ✅ Leaderboard lengkap
- ✅ Ganti password
- ✅ Toggle bahasa ID/EN

**Admin Role (semua fitur member, plus):**
- ✅ Manajemen akun: create/read/update/delete member, set role
- ✅ Manajemen tugas: CRUD, kategori, deadline, max score, deskripsi
- ✅ Penilaian: input score, feedback, accept/reject submission
- ✅ Absensi: manual checklist per pertemuan (meeting_no + tanggal)
- ✅ Pengumuman: CRUD, publish/unpublish
- ✅ Kategori: CRUD (coding, design, dll)
- ✅ Gallery: upload/manage foto
- ✅ Rekap: statistik per anggota, per tugas, export CSV
- ✅ Settings: bobot poin, judul site, contact info
- ✅ Kirim notifikasi in-app ke member

### 2.2 Out of Scope (v1.0)
- ❌ Notifikasi WhatsApp/email eksternal
- ❌ Auto-attendance via WA reply
- ❌ Payment/donasi
- ❌ Forum diskusi
- ❌ Real-time chat
- ❌ Mobile app (responsive web cukup)

---

## 3. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Monorepo** | pnpm + Turborepo | Manage 2 apps + shared packages |
| **Frontend** | Next.js 15 (App Router) + React 18 | Latest stable, App Router untuk routing |
| **Styling** | Tailwind CSS v4 | Utility-first, konsisten dengan design tokens |
| **UI Components** | Radix UI primitives + custom | Headless, accessible, custom styling |
| **Animation** | Framer Motion | Smooth micro-interactions |
| **Database** | SQLite (better-sqlite3) | Zero config, file-based, cukup untuk ekskul |
| **ORM** | Drizzle ORM | Type-safe, fast, schema-first |
| **Auth** | NextAuth.js v5 (Auth.js) | Credentials provider, session management |
| **File Storage** | Vercel Blob | Persisten, integrated, 100MB/file |
| **Validation** | Zod | Schema validation, type-safe |
| **Forms** | React Hook Form + Zod resolver | Performant, validation |
| **i18n** | next-intl | Bilingual ID/EN |
| **Deploy** | Vercel | Free tier, Next.js optimized |

### 3.1 Package Manager
```bash
pnpm@9.11.0
```

### 3.2 Node Version
```bash
>=20.0.0 LTS
```

---

## 4. Monorepo Structure

```
itc/
├─ pnpm-workspace.yaml           # Workspace config
├─ package.json                  # Root scripts
├─ turbo.json                    # Turborepo pipeline
├─ .env.example                  # Environment variables template
├─ .gitignore
├─ tsconfig.base.json            # Shared TypeScript config
├─ README.md
│
├─ docs/
│  ├─ PLAN.md                    # This file
│  ├─ DESIGN.md                  # Design system & UI/UX spec
│  ├─ SCHEMA.md                  # Database schema
│  ├─ ARCHITECTURE.md            # Folder structure & data flow
│  ├─ FEATURES.md                # Feature specification per role
│  ├─ RANKING.md                 # Poin & ranking algorithm
│  ├─ DEPLOY.md                  # Deployment guide
│  └─ CHECKLIST.md               # Implementation checklist
│
├─ packages/
│  ├─ db/                        # Database layer
│  │  ├─ drizzle.config.ts
│  │  ├─ src/
│  │  │  ├─ schema.ts            # Drizzle schema
│  │  │  ├─ index.ts             # Export
│  │  │  ├─ client.ts            # Database client
│  │  │  └─ migrate.ts           # Migration script
│  │  ├─ migrations/
│  │  └─ package.json
│  │
│  ├─ types/                     # Shared TypeScript types
│  │  ├─ src/
│  │  │  ├─ user.ts
│  │  │  ├─ assignment.ts
│  │  │  ├─ submission.ts
│  │  │  └─ index.ts
│  │  └─ package.json
│  │
│  └─ config/                    # Shared configs
│     ├─ src/
│     │  ├─ theme.ts             # Design tokens (colors, spacing, etc.)
│     │  ├─ i18n/
│     │  │  ├─ id.json
│     │  │  └─ en.json
│     │  └─ index.ts
│     └─ package.json
│
└─ apps/
   ├─ web/                       # Public landing page
   │  ├─ public/
   │  │  └─ images/
   │  ├─ src/
   │  │  ├─ app/
   │  │  │  ├─ layout.tsx
   │  │  │  └─ page.tsx
   │  │  ├─ components/
   │  │  │  ├─ sections/
   │  │  │  └─ ui/
   │  │  └─ lib/
   │  ├─ next.config.js
   │  ├─ tailwind.config.ts
   │  └─ package.json
   │
   └─ dashboard/                 # Auth + submission app
      ├─ public/
      │  └─ uploads/             # Local dev only (Blob di production)
      ├─ src/
      │  ├─ app/
      │  │  ├─ (auth)/
      │  │  │  ├─ login/
      │  │  │  └─ layout.tsx
      │  │  ├─ (member)/
      │  │  │  ├─ dashboard/
      │  │  │  ├─ assignments/
      │  │  │  ├─ submissions/
      │  │  │  ├─ leaderboard/
      │  │  │  ├─ notifications/
      │  │  │  ├─ settings/
      │  │  │  └─ layout.tsx    # Protected layout
      │  │  ├─ (admin)/
      │  │  │  ├─ admin/
      │  │  │  │  ├─ users/
      │  │  │  │  ├─ assignments/
      │  │  │  │  ├─ categories/
      │  │  │  │  ├─ grading/
      │  │  │  │  ├─ attendance/
      │  │  │  │  ├─ announcements/
      │  │  │  │  ├─ gallery/
      │  │  │  │  ├─ reports/
      │  │  │  │  └─ settings/
      │  │  │  └─ layout.tsx    # Admin layout
      │  │  ├─ api/
      │  │  │  ├─ auth/[...nextauth]/
      │  │  │  ├─ assignments/
      │  │  │  ├─ submissions/
      │  │  │  ├─ upload/
      │  │  │  └─ ...
      │  │  └─ layout.tsx
      │  ├─ components/
      │  │  ├─ auth/
      │  │  ├─ dashboard/
      │  │  ├─ assignments/
      │  │  ├─ submissions/
      │  │  ├─ admin/
      │  │  ├─ ui/
      │  │  └─ layout/
      │  ├─ lib/
      │  │  ├─ auth.ts
      │  │  ├─ db.ts
      │  │  ├─ blob.ts
      │  │  ├─ points.ts
      │  │  └─ utils.ts
      │  ├─ hooks/
      │  ├─ stores/              # Zustand (jika perlu)
      │  └─ types/
      ├─ next.config.js
      ├─ tailwind.config.ts
      └─ package.json
```

---

## 5. Implementation Phases

### Phase 0: Setup & Foundation (Day 1)
**Goal**: Monorepo ready, design tokens, database schema

**Tasks:**
- [ ] Init pnpm workspace + Turborepo
- [ ] Setup Next.js di `apps/web` + `apps/dashboard`
- [ ] Setup Tailwind v4 + Radix UI + Framer Motion
- [ ] Create `packages/db` dengan Drizzle schema lengkap
- [ ] Setup `packages/types` + `packages/config`
- [ ] Config `.env.example` (DATABASE_URL, AUTH_SECRET, BLOB_READ_WRITE_TOKEN)
- [ ] Seed script: admin pertama + kategori default
- [ ] Design tokens di `packages/config/src/theme.ts`

**Deliverable**: `pnpm dev` jalan, database terisi admin + kategori

---

### Phase 1: Database & Auth (Day 2)
**Goal**: Login berfungsi, role-based access

**Tasks:**
- [ ] Drizzle migration untuk semua tabel
- [ ] NextAuth.js v5 credentials provider
- [ ] Password hashing (bcrypt)
- [ ] Login page `apps/dashboard/login`
- [ ] Protected layout untuk member + admin
- [ ] Role guard middleware
- [ ] Logout functionality
- [ ] Session management

**Deliverable**: Admin bisa login, akses halaman admin, member bisa login, akses halaman member

---

### Phase 2: Public Landing Page (Day 3-4)
**Goal**: Landing page live, informative

**Tasks:**
- [x] `apps/web`: Setup layout + design tokens
- [x] Hero section (Lima AI layout + floating task hub with live DB data)
- [x] About IT Club / Platform (divisi, accordion, live leaderboard tab)
- [x] Jadwal preview (fetch 3 upcoming meetings from DB)
- [x] Pengumuman terbaru (latest published announcements from DB)
- [x] Gallery & campus photography integration
- [x] Leaderboard (fetch dari DB, nama + poin)
- [x] CTA section & 3D Isometric Keyboard
- [x] Footer (newsletter, link columns, giant wordmark)
- [x] Responsive design
- [x] Bilingual toggle ID/EN

**Deliverable**: Landing page accessible publik, menampilkan data dari DB

---

### Phase 3: Member Features (Day 5-6)
**Goal**: Member bisa submit tugas

**Tasks:**
- [x] Dashboard layout (sidebar + header + content)
- [x] Dashboard member: ringkasan tugas, poin, rank
- [x] Assignments list (active, upcoming, past)
- [x] Assignment detail (deskripsi, deadline, max score)
- [x] Submit page: upload file + link URL
- [x] File upload handler (maks. 100MB)
- [x] Edit submission (sebelum deadline)
- [x] Submission history + status
- [x] Nilai tugas (score + feedback)
- [x] Notifications bell + list
- [x] Leaderboard lengkap
- [x] Settings: ganti password, toggle bahasa
- [x] State management & live calculations

**Deliverable**: Member bisa submit tugas, lihat nilai, notifikasi, leaderboard

---

### Phase 4: Admin Features (Day 7-9)
**Goal**: Admin bisa manage semua

**Tasks:**
- [x] Admin dashboard layout
- [x] User management: CRUD + role assignment
- [x] Assignment management: CRUD + kategori
- [x] Category management: CRUD
- [x] Grading: list submission, input score + feedback, accept/reject
- [x] Attendance: manual checklist per meeting
- [x] Announcement management: CRUD + publish
- [x] Gallery management: upload + delete
- [x] Reports: statistik + export CSV
- [x] Settings: site config, poin weights
- [x] Send notification to members

**Deliverable**: Admin bisa manage users, assignments, grades, attendance, announcements

---

### Phase 5: Polish & Deploy (Day 10-11)
**Goal**: Production ready

**Tasks:**
- [x] Animations (Framer Motion)
- [x] Micro-interactions (hover, focus, transitions)
- [x] Loading states + skeleton screens
- [x] Error handling + toast notifications
- [x] Responsive audit (mobile, tablet, desktop)
- [x] Accessibility (keyboard nav, ARIA, focus management)
- [x] Performance: lazy load, code split, optimize images
- [x] SEO: meta tags, Open Graph, sitemap
- [x] Deploy `apps/web` ke Vercel
- [x] Deploy `apps/dashboard` ke Vercel
- [x] Setup Vercel Blob
- [x] Production env variables
- [x] Test semua flows

**Deliverable**: Live di Vercel, semua fitur jalan

---

### Phase 6: Content & Launch (Day 12)
**Goal**: Real data, launch

**Tasks:**
- [ ] Input semua anggota ke database
- [ ] Upload foto gallery
- [ ] Create pengumuman pertama
- [ ] Create tugas pertama
- [ ] Distribute credentials ke anggota
- [ ] Monitor 1 minggu pertama
- [ ] Collect feedback
- [ ] Bug fixes

**Deliverable**: Portal live, anggota mulai submit

---

## 6. Team & Responsibilities

| Role | Person | Responsibility |
|------|--------|----------------|
| **Founder/Admin** | [Nama] | Owner, content, user management, grading |
| **Developer** | [Nama] | Full-stack development, deployment |

**Note**: Untuk ekskul, bisa 1 orang handle semua (founder = admin + developer)

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vercel Blob quota habis | Upload gagal | Monitor usage, archive old files |
| SQLite concurrent write | Performance | Low traffic ekskul, acceptable |
| NextAuth session expired | User frustrated | Remember me, smooth re-login |
| File upload > 100MB | Rejected | Clear error message, suggest link URL |
| Database corruption | Data loss | Daily backup script, export CSV weekly |
| Anggota lupa password | Support burden | Admin reset password via dashboard |

---

## 8. Future Enhancements (v2.0)

- [ ] Email notification (Resend/SMTP)
- [ ] WhatsApp notification (Fonnte/Wablas)
- [ ] Auto-attendance via WA reply
- [ ] Discussion thread per assignment
- [ ] Peer review / voting
- [ ] Export PDF report per anggota
- [ ] Calendar integration (Google Calendar)
- [ ] Dark mode toggle
- [ ] PWA / offline mode
- [ ] SSO dengan akun sekolah
- [ ] Multi-ekskul support

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **Ekskul** | Ekstrakurikuler |
| **IT Club** | Ekstrakurikuler Information Technology di SMKN 1 Surabaya |
| **Assignment/Tugas** | Tugas yang diberikan admin setiap pertemuan |
| **Submission** | Kiriman tugas dari member (file + link) |
| **Leaderboard** | Peringkat poin anggota |
| **Attendance/Absensi** | Kehadiran per pertemuan |
| **Meeting/Pertemuan** | Sesi ekskul (biasanya seminggu sekali) |
| **Blob** | Vercel Blob Storage untuk file uploads |
| **Drizzle** | ORM untuk database access |

---

## 10. References

- **Inspiration UI**: [Link referensi gambar]
- **Vercel Blob Docs**: https://vercel.com/docs/storage/vercel-blob
- **NextAuth v5**: https://authjs.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Next.js App Router**: https://nextjs.org/docs/app

---

**Last Updated**: 2026-10-10
**Next Action**: Review Phase 0 tasks, setup monorepo
