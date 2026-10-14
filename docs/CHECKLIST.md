# CHECKLIST — Implementation Checklist

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Use**: Track progress during implementation
**Legend**: `[ ]` pending · `[~]` in progress · `[x]` done

---

## Phase 0: Setup & Foundation

### 0.1 Monorepo Setup
- [x] Create `pnpm-workspace.yaml`
- [x] Create root `package.json` with scripts
- [x] Create `turbo.json` with pipeline
- [x] Create `.gitignore`
- [x] Create `.env.example`
- [x] Create `tsconfig.base.json`
- [x] Run `pnpm install` successfully

### 0.2 Shared Packages
- [x] Create `packages/db/` structure
- [x] Create `packages/db/drizzle.config.ts`
- [x] Create `packages/db/src/client.ts` (@libsql/client + Drizzle)
- [x] Create `packages/db/src/schema.ts` (all tables)
- [x] Create `packages/db/src/seed.ts`
- [x] Create `packages/types/` with all type definitions
- [x] Create `packages/config/src/theme.ts` (design tokens)
- [x] Create `packages/config/src/i18n/id.json`
- [x] Create `packages/config/src/i18n/en.json`
- [x] Test: `pnpm --filter @itc/db db:push` works
- [x] Test: `pnpm --filter @itc/db db:seed` works

### 0.3 App Shells
- [x] Create `apps/web/` Next.js app
- [x] Create `apps/dashboard/` Next.js app
- [x] Configure Tailwind CSS in both apps
- [x] Configure next-intl in both apps
- [x] Add Google Fonts (Inter, Inter Tight, JetBrains Mono)
- [x] Test: both apps build successfully

---

## Phase 1: Database & Auth

### 1.1 Database
- [x] Run `pnpm drizzle-kit generate` (creates migration)
- [x] Run `pnpm drizzle-kit push` (applies to DB)
- [x] Verify: all tables exist in SQLite
- [x] Run `pnpm db:seed` (creates admin + categories + settings)
- [x] Verify: admin user exists (admin / admin123)
- [x] Verify: categories exist (Coding, Design, Documentation, Presentation)
- [x] Verify: settings exist (site_title, point_weights, contact_*)

### 1.2 Auth (apps/dashboard)
- [x] Install NextAuth.js v5
- [x] Create `apps/dashboard/src/lib/auth.ts`
- [x] Create `apps/dashboard/src/app/api/auth/[...nextauth]/route.ts`
- [x] Create `apps/dashboard/src/middleware.ts` (protect routes)
- [x] Create `apps/dashboard/src/lib/permissions.ts` (requireUser, requireAdmin)
- [x] Create login page `apps/dashboard/src/app/(auth)/login/page.tsx`
- [x] Create login form component
- [x] Test: admin can login
- [x] Test: member can login
- [x] Test: unauthenticated user redirects to /login
- [x] Test: non-admin cannot access /admin
- [x] Test: logout works

---

## Phase 2: Public Landing Page (apps/web)

### 2.1 Layout & Design System
- [x] Create root layout with fonts + metadata
- [x] Apply design tokens (colors, typography, spacing)
- [x] Create `SectionLabel` component
- [x] Create `CornerFrame` component
- [x] Create `TickRing` component
- [x] Create `Dial` component
- [x] Create `SpecCard` component
- [x] Create `DataRow` component
- [x] Create `BlobField` component
- [x] Create `OversizedWordmark` component
- [x] Create `Button` component (solid, outline, accent)
- [x] Test: all components render correctly

### 2.2 Sections
- [x] Hero section (Lima AI 2-column split + photo panel + floating task hub window + CTAs)
- [x] About / Platform section (photo panel + floating status cards + interactive accordion)
- [x] Systems / Focused Suite section (2x2 grid + corner marks + mock UI widgets)
- [x] Schedule preview (upcoming meetings from DB)
- [x] Gallery & campus photography integration
- [x] Announcements & stats live integration from DB
- [x] Leaderboard public (top leaderboard from DB)
- [x] Integrations section (isometric keycaps + elevated brand badge)
- [x] Footer (OversizedWordmark + newsletter + link columns)

### 2.3 Data Integration
- [x] Fetch upcoming meetings from DB
- [x] Fetch latest announcements from DB
- [x] Fetch gallery images / assets
- [x] Fetch leaderboard from DB
- [x] Handle loading states (Skeleton)
- [x] Handle error states (EmptyState)

### 2.4 Bilingual
- [x] Set up i18n dictionary system
- [x] Add ID translations
- [x] Add EN translations
- [x] Add language toggle in header
- [x] Test: toggle works, persists in cookie

### 2.5 Responsive & Motion
- [x] Mobile layout (stack sections, hamburger nav)
- [x] Tablet layout (2-col grids)
- [x] Desktop layout (12-col grid)
- [x] Add scroll reveals and interactive transitions
- [x] Add hover states
- [x] Test: responsive on mobile, tablet, desktop

---

## Phase 3: Member Features (apps/dashboard)

### 3.1 Shell Layout
- [x] Create `AppShell` (sidebar + topbar + content)
- [x] Create `Sidebar` (nav links, active indicator, mobile drawer)
- [x] Create `Topbar` (breadcrumb, notification bell with unread indicator, user badge)
- [x] Create `MobileNav` (drawer for mobile)
- [x] Apply sharp non-rounded shell design (`rounded-none`, `#111111`)
- [x] Test: navigation works
- [x] Test: responsive (drawer on mobile)

### 3.2 Member Dashboard
- [x] Create `/dashboard` page
- [x] Create KPI Stats (total points, rank, submission status, deadline countdown)
- [x] Create NextDeadline indicator
- [x] Create RecentSubmissions list
- [x] Fetch data: user points, rank, next deadline, recent submissions
- [x] Handle loading + error states
- [x] Test: dashboard shows correct data

### 3.3 Assignments
- [x] Create `/assignments` page (list)
- [x] Create AssignmentCard list with category badge, score, deadline
- [x] Create filter tabs (Semua, Aktif, Selesai, Terlambat)
- [x] Fetch data: published assignments
- [x] Create `/assignments/[id]` page (detail)
- [x] Render markdown description
- [x] Show deadline countdown
- [x] Show submission status
- [x] Test: assignment list loads
- [x] Test: assignment detail loads

### 3.4 Submit Assignment
- [x] Create `AssignmentSubmitForm` component
- [x] Create dropzone component (file upload)
- [x] Integrate file upload handler (100MB max)
- [x] Add file size validation (100MB max)
- [x] Add link URL input (GitHub / Figma)
- [x] Create API route `POST /api/upload`
- [x] Create API route `POST /api/submissions`
- [x] Create API route `PATCH /api/submissions/[id]`
- [x] Create API route `DELETE /api/submissions/[id]`
- [x] Test: upload file successfully
- [x] Test: submit with link URL
- [x] Test: edit submission before deadline
- [x] Test: cannot submit after deadline
- [x] Test: update existing submission before deadline

### 3.5 Submission History
- [x] Create `/submissions` page
- [x] Create `SubmissionsClient` component with status filter
- [x] Add status filter (Semua, Pending, Dinilai, Revisi)
- [x] Fetch data: own submissions with scores and feedback
- [x] Test: history loads correctly

### 3.6 Leaderboard (Full)
- [x] Create `/leaderboard` page
- [x] Show top 3 podium (1st, 2nd, 3rd)
- [x] Show full ranking table (rank, name, class, submissions, points)
- [x] Highlight own rank with special badge
- [x] Fetch data: full leaderboard
- [x] Test: leaderboard loads correctly

### 3.7 Notifications
- [x] Create `/notifications` page
- [x] Create notification list component
- [x] Add unread indicator
- [x] Create API route `GET /api/notifications`
- [x] Create API route `PATCH /api/notifications/[id]`
- [x] Create API route `PATCH /api/notifications` (mark all read)
- [x] Add notification bell in Topbar with unread count
- [x] Test: notifications load
- [x] Test: mark as read works
- [x] Test: unread count updates

### 3.8 Settings
- [x] Create `/settings` page
- [x] Create change password form
- [x] Add language toggle
- [x] Show account info (read-only)
- [x] Test: change password works
- [x] Test: language toggle works

---

## Phase 4: Admin Features (apps/dashboard)

### 4.1 Admin Layout
- [x] Create admin layout (extends AppShell)
- [x] Add admin-only nav items
- [x] Protect all `/admin` routes with `requireAdmin()`
- [x] Test: non-admin cannot access

### 4.2 Admin Overview
- [x] Create `/admin` page
- [x] Show KPI StatCards (members, pending, graded, attendance)
- [x] Show Dial (submission rate)
- [x] Show recent activity
- [x] Fetch data: admin stats
- [x] Test: overview loads correctly

### 4.3 User Management
- [x] Create `/admin/users` page
- [x] Create `UserTable` component
- [x] Add search + filter
- [x] Create `UserForm` modal (create/edit)
- [x] Create API routes (CRUD users)
- [x] Add reset password action
- [x] Add delete action (with confirmation)
- [x] Test: create user
- [x] Test: edit user
- [x] Test: delete user (with cascade)
- [x] Test: cannot delete self
- [x] Test: cannot delete last admin

### 4.4 Assignment Management
- [x] Create `/admin/assignments` page
- [x] Create `AssignmentForm` modal (create/edit)
- [x] Add category select
- [x] Add deadline picker
- [x] Add status toggle (draft/published)
- [x] Create API routes (CRUD assignments)
- [x] Test: create assignment
- [x] Test: edit assignment
- [x] Test: publish/unpublish
- [x] Test: delete (archive if has submissions)
- [x] Test: notification sent to members on publish

### 4.5 Category Management
- [x] Create `/admin/categories` page
- [x] Create inline form (create/edit)
- [x] Create API routes (CRUD categories)
- [x] Test: create category
- [x] Test: edit category
- [x] Test: delete (reject if has assignments)

### 4.6 Grading
- [x] Create `/admin/grading` page
- [x] Create submission queue (left panel)
- [x] Create grading panel (right panel)
- [x] Add file preview (link to Blob)
- [x] Add score input
- [x] Add feedback textarea
- [x] Add accept/reject buttons
- [x] Create API route `GET /api/admin/grading`
- [x] Create API route `PATCH /api/admin/grading/[id]`
- [x] Test: view submission queue
- [x] Test: grade submission
- [x] Test: re-grade submission
- [x] Test: accept/reject
- [x] Test: notification sent to member

### 4.7 Attendance
- [x] Create `/admin/attendance` page
- [x] Create meeting selector (create/select)
- [x] Create member checklist
- [x] Add select all / deselect all
- [x] Create API route `POST /api/admin/attendance`
- [x] Test: create meeting session
- [x] Test: save attendance
- [x] Test: edit attendance
- [x] Test: cannot create duplicate meeting_no

### 4.8 Announcements
- [x] Create `/admin/announcements` page
- [x] Create `AnnouncementForm` modal
- [x] Add publish toggle
- [x] Add pin toggle
- [x] Create API routes (CRUD announcements)
- [x] Test: create announcement
- [x] Test: publish/unpublish
- [x] Test: pin/unpin
- [x] Test: delete
- [x] Test: notification sent on publish

### 4.9 Gallery
- [x] Create `/admin/gallery` page
- [x] Create upload zone
- [x] Create image grid
- [x] Add edit caption (inline)
- [x] Add delete (with confirmation)
- [x] Add reorder (drag-and-drop)
- [x] Test: upload image
- [x] Test: edit caption
- [x] Test: delete image
- [x] Test: reorder

### 4.10 Reports
- [x] Create `/admin/reports` page
- [x] Show summary cards
- [x] Show per-member table
- [x] Show per-assignment table
- [x] Add export CSV buttons
- [x] Create API route `GET /api/admin/reports`
- [x] Create API route `GET /api/admin/reports/export`
- [x] Test: reports load correctly
- [x] Test: CSV export works

### 4.11 Settings
- [x] Create `/admin/settings` page
- [x] Add site settings form
- [x] Add point weights form
- [x] Create API routes (GET/PUT settings)
- [x] Test: update site settings
- [x] Test: update point weights
- [x] Test: changes apply immediately

---

## Phase 5: Polish & Deploy

### 5.1 Animations & Micro-interactions
- [x] Add Framer Motion to all pages
- [x] Add scroll reveals (staggered)
- [x] Add hover states on all interactive elements
- [x] Add page transitions
- [x] Add loading animations
- [x] Test: animations smooth (no jank)
- [x] Test: respects prefers-reduced-motion

### 5.2 Loading & Error States
- [x] Add Skeleton components
- [x] Add to all data-fetching pages
- [x] Add EmptyState components
- [x] Add ErrorBoundary
- [x] Add toast notifications (success, error, info)
- [x] Test: loading states show
- [x] Test: empty states show
- [x] Test: error states show

### 5.3 Responsive Audit
- [x] Test landing page on mobile (375px)
- [x] Test landing page on tablet (768px)
- [x] Test landing page on desktop (1440px)
- [x] Test dashboard on mobile
- [x] Test dashboard on tablet
- [x] Test dashboard on desktop
- [x] Fix any layout issues
- [x] Fix any overflow issues

### 5.4 Accessibility
- [x] Add focus states to all interactive elements
- [x] Add ARIA labels to icons
- [x] Add skip-to-content link
- [x] Test keyboard navigation
- [x] Test screen reader (basic)
- [x] Verify color contrast (WCAG AA)
- [x] Verify tap targets (min 44px mobile)

### 5.5 Performance
- [x] Optimize images (WebP, lazy load)
- [x] Code split (dynamic imports)
- [x] Minimize bundle size
- [x] Add meta tags (SEO)
- [x] Add Open Graph tags
- [x] Add sitemap
- [x] Test: Lighthouse score ≥ 90

### 5.6 Security
- [x] Verify password hashing (bcrypt)
- [x] Verify session management (JWT httpOnly)
- [x] Verify role-based access (middleware + guards)
- [x] Verify input validation (Zod)
- [x] Verify SQL injection prevention (Drizzle parameterized)
- [x] Verify XSS prevention (React escaping)
- [x] Verify file upload security (size, type)
- [x] Test: all security checks pass

### 5.7 Deploy
- [x] Push code to GitHub
- [x] Import `apps/web` to Vercel
- [x] Import `apps/dashboard` to Vercel
- [x] Set up Turso database
- [x] Add environment variables
- [x] Run migrations on Turso
- [x] Seed production database
- [x] Link Vercel Blob
- [x] Deploy both apps
- [x] Change admin password
- [x] Test: landing page live
- [x] Test: dashboard live
- [x] Test: login works
- [x] Test: file upload works
- [x] Test: all features work

---

## Phase 6: Launch

### 6.1 Content
- [ ] Add all members to database
- [ ] Upload gallery photos
- [ ] Publish welcome announcement
- [ ] Create first assignment
- [ ] Create first attendance session

### 6.2 Distribution
- [ ] Share dashboard URL with members
- [ ] Provide credentials (username + temp password)
- [ ] Instruct members to change password

### 6.3 Monitoring
- [ ] Monitor for 1 week
- [ ] Collect feedback
- [ ] Fix bugs
- [ ] Iterate

---

## Summary

| Phase | Tasks | Status |
|---|---|---|
| Phase 0: Setup | 20 | 20/20 |
| Phase 1: DB & Auth | 14 | 14/14 |
| Phase 2: Landing | 30 | 30/30 |
| Phase 3: Member | 40 | 40/40 |
| Phase 4: Admin | 50 | 50/50 |
| Phase 5: Polish | 30 | 30/30 |
| Phase 6: Launch | 10 | 0/10 |
| **Total** | **194** | **184/194** |

---

**End of CHECKLIST.md**
