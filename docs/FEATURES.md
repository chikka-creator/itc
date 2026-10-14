# FEATURES — Feature Specification

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Scope**: Detailed feature specification for all user roles

---

## Table of Contents

1. [Role Matrix](#1-role-matrix)
2. [Public Landing Features](#2-public-landing-features)
3. [Member Features](#3-member-features)
4. [Admin Features](#4-admin-features)
5. [Notification System](#5-notification-system)
6. [Edge Cases & Business Rules](#6-edge-cases--business-rules)

---

## 1. Role Matrix

| Feature | Public | Member | Admin |
|---------|--------|--------|-------|
| View landing page | ✅ | ✅ | ✅ |
| View announcements | ✅ | ✅ | ✅ |
| View schedule | ✅ | ✅ | ✅ |
| View gallery | ✅ | ✅ | ✅ |
| View leaderboard (top 10, public) | ✅ | ✅ | ✅ |
| View full leaderboard | — | ✅ | ✅ |
| Login | — | ✅ | ✅ |
| View own dashboard | — | ✅ | ✅ |
| View assignments | — | ✅ | ✅ |
| Submit assignment | — | ✅ | — |
| Edit own submission (before deadline) | — | ✅ | — |
| View own grades | — | ✅ | ✅ |
| View own submission history | — | ✅ | ✅ |
| Receive notifications | — | ✅ | ✅ |
| Mark notifications as read | — | ✅ | ✅ |
| Change own password | — | ✅ | ✅ |
| Toggle language | ✅ | ✅ | ✅ |
| Manage users | — | — | ✅ |
| Manage assignments | — | — | ✅ |
| Manage categories | — | — | ✅ |
| Grade submissions | — | — | ✅ |
| Manage attendance | — | — | ✅ |
| Manage announcements | — | — | ✅ |
| Manage gallery | — | — | ✅ |
| View reports | — | — | ✅ |
| Export CSV | — | — | ✅ |
| Manage settings | — | — | ✅ |
| Send notifications | — | — | ✅ |

---

## 2. Public Landing Features

### 2.1 Hero Section
- **Purpose:** First impression, brand identity
- **Elements:**
  - SectionLabel: `• EKSTRAKURIKULER • IT CLUB •`
  - Headline: "Membangun generasi teknologi SMK Negeri 1 Surabaya"
  - Subtext: "Belajar, berkarya, dan berinovasi bersama."
  - CTA buttons: "Masuk Dashboard" (→ `/login`), "Tentang Kami" (→ `#about`)
  - Background: BlobField (2 blue orbs)
  - Frame: CornerFrame around text block
  - Optional: Dial showing next meeting countdown or member count

### 2.2 About Section
- **Purpose:** Introduce IT Club
- **Elements:**
  - SectionLabel: `• TENTANG • IT CLUB •`
  - Headline: "Satu klub. Sistem terhubung."
  - Description: 2-3 paragraphs about IT Club
  - Stats: SpecCard row (Anggota aktif, Pertemuan per tahun, Proyek selesai)
  - Divisi: DataRow list (Web Dev, Mobile Dev, UI/UX, Cybersecurity, AI/ML)

### 2.3 Schedule Preview
- **Purpose:** Show upcoming meetings
- **Elements:**
  - SectionLabel: `• JADWAL • PERTEMUAN •`
  - 3 DataRows: upcoming meetings (day, time, topic, room)
  - Button: "Lihat Semua" → scroll to full schedule or link

### 2.4 Gallery
- **Purpose:** Show activities visually
- **Elements:**
  - SectionLabel: `• GALERI • KEGIATAN •`
  - 1 hero image (TickRing circular mask)
  - 6-image grid (2x3 on desktop, 1x2 on mobile)
  - Hover: image scale + caption overlay

### 2.5 Announcements
- **Purpose:** Latest news
- **Elements:**
  - SectionLabel: `• PENGUMUMAN •`
  - 3 latest published announcements
  - Each: title, date, excerpt, "Baca Selengkapnya" link

### 2.6 Leaderboard (Public)
- **Purpose:** Show top contributors
- **Elements:**
  - SectionLabel: `• LEADERBOARD • PUBLIK •`
  - Top 10: rank, name, points
  - Top 3 highlighted with accent
  - Note: "Diperbarui otomatis dari sistem."
  - **Privacy:** name + points only. No class, no scores, no attendance detail.

### 2.7 CTA Section
- **Purpose:** Recruitment
- **Elements:**
  - SectionLabel: `• GABUNG • SEKARANG •`
  - Headline: "Siap jadi bagian dari IT Club?"
  - Subtext: "Hubungi admin untuk mendaftar."
  - Button: "Hubungi Kami" → WhatsApp link or email
  - Background: BlobField + CornerFrame

### 2.8 Footer
- **Elements:**
  - OversizedWordmark: "ITCLUB" outline stroke
  - Contact: email, WhatsApp, Instagram
  - Links: Tentang, Jadwal, Galeri, Leaderboard
  - Credit: "© 2026 IT Club SMKN 1 Surabaya"

---

## 3. Member Features

### 3.1 Login
- **Route:** `/login`
- **UI:**
  - Centered card on navy background
  - Logo + site title
  - Username input
  - Password input (with show/hide toggle)
  - "Masuk" button (btn--accent)
  - Error message (inline, danger color)
- **Behavior:**
  - On success: redirect to `/dashboard`
  - On failure: show "Username atau password salah"
  - Already logged in: redirect to `/dashboard`

### 3.2 Dashboard (Member Overview)
- **Route:** `/dashboard`
- **UI:**
  - Topbar: greeting "Halo, {name}", notification bell, avatar
  - 3 StatDial cards: Poin, Peringkat, Submission Rate
  - Next Deadline section: upcoming assignment with countdown
  - Recent Submissions: last 5 submissions with status
  - Quick Actions: "Lihat Tugas", "Riwayat", "Leaderboard"

### 3.3 Assignments List
- **Route:** `/assignments`
- **UI:**
  - Filter tabs: Semua, Aktif, Selesai, Terlambat
  - AssignmentCard list: title, category, deadline, status dot
  - Each card links to detail page
- **Data:** All published assignments, sorted by deadline (nearest first)

### 3.4 Assignment Detail + Submit
- **Route:** `/assignments/[id]`
- **UI:**
  - Title, category, description (markdown rendered)
  - Deadline: Dial or countdown
  - Max score
  - SubmitForm (if not yet submitted and before deadline):
    - File upload: drag-and-drop zone, progress bar, file preview
    - Link URL: text input (optional, GitHub/Drive/etc.)
    - Submit button
  - If already submitted: show submission status, file/link, score (if graded)
  - If deadline passed: show "Deadline telah berakhir"
- **Rules:**
  - One submission per assignment per member
  - Can edit before deadline (re-upload file or change link)
  - Cannot submit after deadline

### 3.5 Submission History
- **Route:** `/submissions`
- **UI:**
  - DataTable: assignment title, submitted date, status, score
  - Filter by status: Semua, Pending, Accepted, Rejected, Graded
  - Sort by date (newest first)

### 3.6 Leaderboard (Full)
- **Route:** `/leaderboard`
- **UI:**
  - Top 3 podium: TickRing avatar, name, points
  - DataRow list: rank 4-20, name, points
  - Own rank highlighted with accent
- **Data:** All members, sorted by total points (descending)

### 3.7 Notifications
- **Route:** `/notifications`
- **UI:**
  - List: icon, title, body, time, read/unread indicator
  - Unread: accent dot + bold title
  - Actions: "Mark all as read", individual "Mark as read"
  - Empty state: "Tidak ada notifikasi"
- **Data:** Notifications for this user (user_id matches) + broadcasts (user_id null)

### 3.8 Settings
- **Route:** `/settings`
- **UI:**
  - Change Password section:
    - Current password input
    - New password input (min 8 chars)
    - Confirm new password input
    - "Ubah Password" button
  - Language toggle: ID / EN
  - Account info: name, username, class (read-only)

---

## 4. Admin Features

### 4.1 Admin Overview
- **Route:** `/admin`
- **UI:**
  - 4 StatCards: Total Anggota, Tugas Aktif, Pending Grading, Rata-rata Kehadiran
  - Dial: submission rate this month
  - Recent activity: last 10 submissions/grades
  - Quick actions: "Buat Tugas", "Input Absen", "Tambah Anggota"

### 4.2 User Management
- **Route:** `/admin/users`
- **UI:**
  - UserTable: name, username, class, role, last login
  - Search: by name or username
  - Filter: by role (admin/member)
  - Actions: edit, delete, reset password
  - "Tambah Anggota" button → modal form
- **Create/Edit Modal:**
  - Name, username, email (optional), class, phone (optional)
  - Role: dropdown (admin/member)
  - Password (create only, or reset)
- **Rules:**
  - Cannot delete self (logged-in admin)
  - Cannot delete last admin
  - Username must be unique

### 4.3 Assignment Management
- **Route:** `/admin/assignments`
- **UI:**
  - List: title, category, deadline, status, submissions count
  - Filter: by status (draft/published/archived)
  - Actions: edit, delete, publish/unpublish
  - "Buat Tugas" button → modal form
- **Create/Edit Modal:**
  - Title (text)
  - Category (select from categories)
  - Description (textarea, markdown)
  - Deadline (datetime picker)
  - Max score (number, default 100)
  - Status: draft or published
- **Rules:**
  - Cannot delete assignment with submissions (archive instead)
  - Cannot delete assignment with graded submissions

### 4.4 Category Management
- **Route:** `/admin/categories`
- **UI:**
  - Simple list: name, slug, color dot, sort order
  - "Tambah Kategori" button → inline form
  - Edit/delete actions
- **Rules:**
  - Cannot delete category with assignments

### 4.5 Grading
- **Route:** `/admin/grading`
- **UI:**
  - Left: submission queue (pending submissions, sorted by date)
  - Right: grading panel
    - Member name, assignment title
    - File preview (link to Blob URL)
    - Link URL (if provided)
    - Submitted time (on-time/late indicator)
    - Score input (0 to max_score)
    - Feedback textarea
    - Accept / Reject buttons
    - "Simpan Nilai" button
- **Rules:**
  - Can grade anytime after submission
  - Can re-grade (update score)
  - Accept = status 'accepted', Reject = status 'rejected', Score = status 'graded'

### 4.6 Attendance Management
- **Route:** `/admin/attendance`
- **UI:**
  - Step 1: Create/select meeting
    - Meeting number (auto-increment or manual)
    - Date picker
    - Title (optional)
    - "Buat Sesi" or "Pilih Sesi"
  - Step 2: Attendance checklist
    - List of all members (sorted by name)
    - Checkbox for each: present/absent
    - Select all / deselect all
    - "Simpan Absensi" button
- **Rules:**
  - Can edit attendance after saving (corrections)
  - Cannot create duplicate meeting_no
  - Only members (not admins) appear in checklist

### 4.7 Announcement Management
- **Route:** `/admin/announcements`
- **UI:**
  - List: title, date, published status, pinned status
  - Actions: edit, delete, publish/unpublish, pin/unpin
  - "Buat Pengumuman" button → modal form
- **Create/Edit Modal:**
  - Title (text)
  - Body (textarea, markdown)
  - Publish toggle (draft/published)
  - Pin toggle

### 4.8 Gallery Management
- **Route:** `/admin/gallery`
- **UI:**
  - Grid of images: thumbnail, caption, sort order
  - Upload: drag-and-drop or click to select
  - Edit caption: inline
  - Delete: with confirmation
  - Reorder: drag-and-drop

### 4.9 Reports
- **Route:** `/admin/reports`
- **UI:**
  - Summary cards: total members, avg score, avg attendance rate
  - Per-member table: name, assignments submitted, avg score, attendance rate, total points
  - Per-assignment table: title, submissions count, avg score, on-time rate
  - Export buttons: "Export Anggota CSV", "Export Tugas CSV"
- **CSV Format:**
  - Members: `name,username,class,submissions,avg_score,attendance_rate,total_points`
  - Assignments: `title,category,deadline,submissions,avg_score,on_time_rate`

### 4.10 Settings
- **Route:** `/admin/settings`
- **UI:**
  - Site settings:
    - Site title (text)
    - Contact email (text)
    - Contact WhatsApp (text)
    - Contact Instagram (text)
  - Point weights:
    - On-time points (number)
    - Late points (number)
    - Missing points (number)
    - Attendance points (number)
  - "Simpan Pengaturan" button
- **Rules:**
  - Point weights must be non-negative integers
  - Changes apply immediately to new calculations

### 4.11 Send Notification
- **Trigger:** Automatic on events (see §5)
- **Manual:** Admin can send broadcast notification via settings or assignment creation

---

## 5. Notification System

### 5.1 Trigger Events

| Event | Trigger | Recipients | Type |
|-------|---------|------------|------|
| New assignment published | Admin creates & publishes assignment | All members | `assignment` |
| Assignment deadline approaching | Cron job: 24h before deadline | Members who haven't submitted | `deadline` |
| Submission graded | Admin grades submission | Submitting member | `grade` |
| Announcement published | Admin publishes announcement | All members | `announcement` |
| Admin manual broadcast | Admin sends notification | All members or specific member | `info` |

### 5.2 Notification Structure

```
┌─────────────────────────────────────────┐
│ ● Assignment Baru: "PHP Dasar"         │  ← accent dot + title
│   Deadline: 15 Oktober 2026, 23:59     │  ← body
│   2 jam lalu                            │  ← timestamp
└─────────────────────────────────────────┘
```

### 5.3 Unread Indicator
- Topbar bell icon with 6px accent dot when unread count > 0
- Badge with count (max "9+")

---

## 6. Edge Cases & Business Rules

### 6.1 Submission Rules

| Scenario | Behavior |
|----------|----------|
| Submit before deadline | Status: `pending`, submitted_at = now |
| Submit after deadline | Rejected with error "Deadline telah berakhir" |
| Edit before deadline | Allowed, updates file/link, status resets to `pending` |
| Edit after deadline | Rejected with error |
| Delete before deadline | Allowed, removes submission |
| Delete after deadline | Rejected with error |
| Duplicate submission | Rejected (UNIQUE constraint) |
| File > 100MB | Rejected with error "File terlalu besar (maks 100MB)" |
| Both file and link empty | Rejected with error "Minimal upload file atau link" |
| File only | Accepted |
| Link only | Accepted |
| Both file and link | Accepted |

### 6.2 Grading Rules

| Scenario | Behavior |
|----------|----------|
| Grade pending submission | Status → `graded`, score set, feedback saved |
| Re-grade graded submission | Allowed, updates score and feedback |
| Score > max_score | Rejected with error |
| Score < 0 | Rejected with error |
| Accept without score | Status → `accepted`, score null |
| Reject | Status → `rejected`, feedback required |

### 6.3 Attendance Rules

| Scenario | Behavior |
|----------|----------|
| Member not in checklist | Status: `absent` (auto) |
| Checklist saved | All members have record for that session |
| Edit after save | Allowed, updates status and marked_by |
| Duplicate meeting_no | Rejected (UNIQUE constraint) |

### 6.4 User Management Rules

| Scenario | Behavior |
|----------|----------|
| Create user | Username must be unique, password min 8 chars |
| Delete self | Rejected |
| Delete last admin | Rejected |
| Delete user with submissions | Submissions cascade delete |
| Reset password | Admin sets new password, user must change on next login (optional) |

### 6.5 Deadline Edge Cases

| Scenario | Behavior |
|----------|----------|
| Deadline = now | Treated as passed (deadline < now) |
| Deadline in different timezone | Store as UTC, display in local (Asia/Jakarta) |
| Assignment archived | Hidden from member list, visible in admin |

---

**End of FEATURES.md**
