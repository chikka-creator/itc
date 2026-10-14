# ARCHITECTURE — System Architecture

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Scope**: Folder structure, data flow, module boundaries, API design

---

## Table of Contents

1. [Monorepo Topology](#1-monorepo-topology)
2. [Shared Packages](#2-shared-packages)
3. [apps/web — Structure](#3-appsweb--structure)
4. [apps/dashboard — Structure](#4-appsdashboard--structure)
5. [Data Flow](#5-data-flow)
6. [Authentication Flow](#6-authentication-flow)
7. [File Upload Flow](#7-file-upload-flow)
8. [API Route Design](#8-api-route-design)
9. [Environment Variables](#9-environment-variables)
10. [Middleware & Guards](#10-middleware--guards)

---

## 1. Monorepo Topology

```
itc/
├─ apps/
│  ├─ web/          ← Public landing (no auth)
│  └─ dashboard/    ← Auth + submission + admin
├─ packages/
│  ├─ db/           ← Drizzle schema, client, migrations, seed
│  ├─ types/        ← Shared TypeScript types
│  └─ config/       ← Theme tokens, i18n dictionaries
├─ docs/            ← All project documentation
├─ turbo.json       ← Pipeline definitions
└─ pnpm-workspace.yaml
```

**Dependency direction:** `apps/*` → `packages/*`. Packages never depend on apps.

---

## 2. Shared Packages

### 2.1 `packages/db`

```
packages/db/
├─ drizzle.config.ts
├─ package.json
├─ src/
│  ├─ client.ts         ← better-sqlite3 connection + Drizzle instance
│  ├─ schema.ts         ← All table definitions
│  ├─ seed.ts           ← Seed script
│  └─ index.ts          ← Re-export
└─ migrations/          ← Generated SQL migrations
```

**`client.ts`:**
```ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = process.env.DATABASE_URL ?? path.join(process.cwd(), 'data.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
```

### 2.2 `packages/types`

```
packages/types/
├─ src/
│  ├─ user.ts
│  ├─ assignment.ts
│  ├─ submission.ts
│  ├─ attendance.ts
│  ├─ announcement.ts
│  └─ index.ts
└─ package.json
```

Contains pure TypeScript interfaces (no Drizzle imports) for use in both apps and API routes.

### 2.3 `packages/config`

```
packages/config/
├─ src/
│  ├─ theme.ts          ← Design tokens (colors, spacing, typography)
│  ├─ i18n/
│  │  ├─ id.json
│  │  └─ en.json
│  └─ index.ts
└─ package.json
```

---

## 3. apps/web — Structure

```
apps/web/
├─ public/
│  └─ images/           ← Static images (logo, og-image)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx     ← Root layout (fonts, metadata, i18n)
│  │  ├─ page.tsx       ← Single-page landing (all sections)
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ sections/      ← One component per landing section
│  │  │  ├─ Hero.tsx
│  │  │  ├─ About.tsx
│  │  │  ├─ Systems.tsx       ← "One club. Connected systems."
│  │  │  ├─ Schedule.tsx
│  │  │  ├─ Gallery.tsx
│  │  │  ├─ Announcements.tsx
│  │  │  ├─ Leaderboard.tsx
│  │  │  ├─ CTA.tsx
│  │  │  └─ Footer.tsx
│  │  └─ ui/            ← Reusable landing components
│  │     ├─ SectionLabel.tsx
│  │     ├─ CornerFrame.tsx
│  │     ├─ TickRing.tsx
│  │     ├─ Dial.tsx
│  │     ├─ SpecCard.tsx
│  │     ├─ DataRow.tsx
│  │     ├─ BlobField.tsx
│  │     └─ OversizedWordmark.tsx
│  ├─ lib/
│  │  ├─ api.ts         ← Fetch helpers (client-side)
│  │  └─ utils.ts       ← Formatting helpers
│  ├─ next.config.js
│  ├─ tailwind.config.ts
└─ package.json
```

**Rendering strategy:** All sections are server components. Data fetched directly from `packages/db` (no API routes needed for public data). Client components only for interactive elements (language toggle, scroll animations).

---

## 4. apps/dashboard — Structure

```
apps/dashboard/
├─ public/
│  └─ favicon.ico
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx              ← Root layout (fonts, metadata)
│  │  ├─ page.tsx                ← Redirect to /login or /dashboard
│  │  │
│  │  ├─ (auth)/
│  │  │  ├─ layout.tsx           ← Centered card layout
│  │  │  └─ login/
│  │  │     └─ page.tsx          ← Login form
│  │  │
│  │  ├─ (member)/               ← Protected: member + admin
│  │  │  ├─ layout.tsx           ← AppShell (sidebar + topbar)
│  │  │  ├─ dashboard/
│  │  │  │  └─ page.tsx          ← Overview
│  │  │  ├─ assignments/
│  │  │  │  ├─ page.tsx          ← List
│  │  │  │  └─ [id]/
│  │  │  │     └─ page.tsx       ← Detail + submit
│  │  │  ├─ submissions/
│  │  │  │  └─ page.tsx          ← History
│  │  │  ├─ leaderboard/
│  │  │  │  └─ page.tsx          ← Full ranking
│  │  │  ├─ notifications/
│  │  │  │  └─ page.tsx          ← Notification list
│  │  │  └─ settings/
│  │  │     └─ page.tsx          ← Password + language
│  │  │
│  │  ├─ (admin)/                ← Protected: admin only
│  │  │  ├─ layout.tsx           ← Admin layout (extends AppShell)
│  │  │  └─ admin/
│  │  │     ├─ page.tsx          ← Admin overview
│  │  │     ├─ users/
│  │  │     │  └─ page.tsx       ← User CRUD
│  │  │     ├─ assignments/
│  │  │     │  └─ page.tsx       ← Assignment CRUD
│  │  │     ├─ categories/
│  │  │     │  └─ page.tsx       ← Category CRUD
│  │  │     ├─ grading/
│  │  │     │  └─ page.tsx       ← Grade submissions
│  │  │     ├─ attendance/
│  │  │     │  └─ page.tsx       ← Attendance checklist
│  │  │     ├─ announcements/
│  │  │     │  └─ page.tsx       ← Announcement CRUD
│  │  │     ├─ gallery/
│  │  │     │  └─ page.tsx       ← Gallery management
│  │  │     ├─ reports/
│  │  │     │  └─ page.tsx       ← Reports + CSV export
│  │  │     └─ settings/
│  │  │        └─ page.tsx       ← Site settings
│  │  │
│  │  └─ api/
│  │     ├─ auth/
│  │     │  └─ [...nextauth]/
│  │     │     └─ route.ts       ← NextAuth handler
│  │     ├─ submissions/
│  │     │  ├─ route.ts          ← GET (list), POST (create)
│  │     │  └─ [id]/
│  │     │     └─ route.ts       ← GET, PATCH, DELETE
│  │     ├─ upload/
│  │     │  └─ route.ts          ← POST (file → Vercel Blob)
│  │     ├─ notifications/
│  │     │  ├─ route.ts          ← GET (list), POST (create)
│  │     │  └─ [id]/
│  │     │     └─ route.ts       ← PATCH (mark read)
│  │     └─ admin/
│  │        ├─ users/
│  │        │  └─ route.ts       ← CRUD
│  │        ├─ assignments/
│  │        │  └─ route.ts       ← CRUD
│  │        ├─ grading/
│  │        │  └─ route.ts       ← PATCH (score, feedback)
│  │        ├─ attendance/
│  │        │  └─ route.ts       ← POST (bulk upsert)
│  │        ├─ announcements/
│  │        │  └─ route.ts       ← CRUD
│  │        └─ settings/
│  │           └─ route.ts       ← GET, PUT
│  │
│  ├─ components/
│  │  ├─ auth/
│  │  │  └─ LoginForm.tsx
│  │  ├─ layout/
│  │  │  ├─ AppShell.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ Topbar.tsx
│  │  │  └─ MobileNav.tsx
│  │  ├─ dashboard/
│  │  │  ├─ StatDial.tsx
│  │  │  ├─ NextDeadline.tsx
│  │  │  └─ RecentSubmissions.tsx
│  │  ├─ assignments/
│  │  │  ├─ AssignmentCard.tsx
│  │  │  ├─ AssignmentList.tsx
│  │  │  └─ SubmitForm.tsx
│  │  ├─ submissions/
│  │  │  ├─ SubmissionTable.tsx
│  │  │  └─ StatusBadge.tsx
│  │  ├─ admin/
│  │  │  ├─ UserTable.tsx
│  │  │  ├─ AssignmentForm.tsx
│  │  │  ├─ GradingPanel.tsx
│  │  │  ├─ AttendanceSheet.tsx
│  │  │  └─ ReportTable.tsx
│  │  ├─ ui/              ← Shared primitives
│  │  │  ├─ Button.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ Modal.tsx
│  │  │  ├─ Dropdown.tsx
│  │  │  ├─ Toast.tsx
│  │  │  ├─ Skeleton.tsx
│  │  │  └─ EmptyState.tsx
│  │  └─ ui-landing/      ← Landing-specific (reuse from web)
│  │
│  ├─ lib/
│  │  ├─ auth.ts           ← NextAuth config
│  │  ├─ db.ts             ← Re-export from packages/db
│  │  ├─ blob.ts           ← Vercel Blob client
│  │  ├─ points.ts         ← Point calculation logic
│  │  ├─ permissions.ts    ← Role check helpers
│  │  └─ utils.ts          ← Formatting, validation
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  ├─ useNotifications.ts
│  │  └─ useMediaQuery.ts
│  ├─ stores/
│  │  └─ auth.ts           ← Zustand auth store (if needed)
│  ├─ next.config.js
│  ├─ tailwind.config.ts
│  └─ package.json
```

---

## 5. Data Flow

### 5.1 Public Data (apps/web)

```
Browser → Next.js Server Component → packages/db (Drizzle) → SQLite
```

No API routes. Server components query the database directly during SSR.

### 5.2 Authenticated Data (apps/dashboard)

```
Browser → Client Component → API Route → packages/db → SQLite
```

Client components fetch from API routes. API routes validate session, execute queries, return JSON.

### 5.3 Admin Mutations

```
Browser → Client Component → API Route (with role check) → packages/db → SQLite
```

All admin mutations go through API routes with `requireAdmin()` guard.

---

## 6. Authentication Flow

**Library:** NextAuth.js v5 (Auth.js) with Credentials provider + JWT strategy.

```
┌─────────┐     POST /api/auth/callback/credentials     ┌──────────┐
│ Browser │ ──────────────────────────────────────────→  │ NextAuth │
│         │                                              │          │
│         │  1. Validate username + password (bcrypt)    │          │
│         │  2. Look up user in DB                       │          │
│         │  3. Build JWT: { id, name, role, username }  │          │
│         │  4. Set httpOnly cookie (7 days)             │          │
│         │                                              │          │
│         │ ←──────────── 302 redirect to /dashboard ───│          │
└─────────┘                                              └──────────┘

Subsequent requests:
  Browser → Cookie (JWT) → NextAuth.getSession() → { user: { id, name, role } }
```

**`lib/auth.ts`:**
```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { db } from '@itc/db';
import { users } from '@itc/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username),
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, role: user.role, username: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: '/login' },
});
```

---

## 7. File Upload Flow

```
Browser → POST /api/upload (FormData: file) → Vercel Blob → returns URL
                                                                ↓
Browser → POST /api/submissions (JSON: { assignmentId, fileUrl, linkUrl }) → DB
```

**Rules:**
- Max file size: 100 MB (enforced by Vercel Blob + client-side check)
- Allowed types: any (zip, pdf, images, code files, video)
- File stored in Vercel Blob with path: `submissions/{userId}/{assignmentId}/{filename}`
- Original filename preserved in `submissions.file_name`
- File size in bytes stored in `submissions.file_size`

---

## 8. API Route Design

### 8.1 Conventions

- All routes use `auth()` from NextAuth to get session
- Member routes: `requireUser()` guard
- Admin routes: `requireAdmin()` guard
- Validation: Zod schemas
- Errors: consistent JSON shape `{ error: string, code: string }`

### 8.2 Route List

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/callback/credentials` | — | NextAuth callback |
| `GET` | `/api/auth/session` | — | Current session |
| `POST` | `/api/submissions` | Member | Create submission |
| `GET` | `/api/submissions` | Member | List own submissions |
| `PATCH` | `/api/submissions/[id]` | Member | Edit own submission (before deadline) |
| `DELETE` | `/api/submissions/[id]` | Member | Delete own submission (before deadline) |
| `POST` | `/api/upload` | Member | Upload file to Blob |
| `GET` | `/api/notifications` | Member | List notifications |
| `PATCH` | `/api/notifications/[id]` | Member | Mark as read |
| `PATCH` | `/api/notifications` | Member | Mark all as read |
| `GET` | `/api/admin/users` | Admin | List users |
| `POST` | `/api/admin/users` | Admin | Create user |
| `PATCH` | `/api/admin/users/[id]` | Admin | Update user |
| `DELETE` | `/api/admin/users/[id]` | Admin | Delete user |
| `GET` | `/api/admin/assignments` | Admin | List assignments |
| `POST` | `/api/admin/assignments` | Admin | Create assignment |
| `PATCH` | `/api/admin/assignments/[id]` | Admin | Update assignment |
| `DELETE` | `/api/admin/assignments/[id]` | Admin | Delete assignment |
| `GET` | `/api/admin/categories` | Admin | List categories |
| `POST` | `/api/admin/categories` | Admin | Create category |
| `PATCH` | `/api/admin/categories/[id]` | Admin | Update category |
| `DELETE` | `/api/admin/categories/[id]` | Admin | Delete category |
| `GET` | `/api/admin/grading` | Admin | List submissions for grading |
| `PATCH` | `/api/admin/grading/[id]` | Admin | Grade submission |
| `POST` | `/api/admin/attendance` | Admin | Bulk upsert attendance |
| `GET` | `/api/admin/announcements` | Admin | List announcements |
| `POST` | `/api/admin/announcements` | Admin | Create announcement |
| `PATCH` | `/api/admin/announcements/[id]` | Admin | Update announcement |
| `DELETE` | `/api/admin/announcements/[id]` | Admin | Delete announcement |
| `GET` | `/api/admin/reports` | Admin | Get report data |
| `GET` | `/api/admin/reports/export` | Admin | Export CSV |
| `GET` | `/api/admin/settings` | Admin | Get settings |
| `PUT` | `/api/admin/settings` | Admin | Update settings |

### 8.3 Error Response Format

```json
{
  "error": "Submission deadline has passed",
  "code": "DEADLINE_PASSED"
}
```

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Not logged in |
| 403 | `FORBIDDEN` | Wrong role |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Duplicate (e.g., already submitted) |
| 422 | `DEADLINE_PASSED` | Business rule violation |
| 500 | `INTERNAL_ERROR` | Server error |

---

## 9. Environment Variables

**File:** `.env.example`

```bash
# Database
DATABASE_URL=./data.db

# NextAuth
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_URL=http://localhost:3000

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxx

# Optional: override point weights (JSON)
# POINT_WEIGHTS={"on_time":10,"late":5,"missing":0,"attendance":5}
```

**Production (Vercel Dashboard):**
- `DATABASE_URL` → not used (see note below)
- `AUTH_SECRET` → auto-generated
- `AUTH_URL` → auto-set by Vercel
- `BLOB_READ_WRITE_TOKEN` → auto-set when Blob storage linked

**Note on SQLite in production:** Vercel serverless functions have ephemeral filesystem. SQLite file-based DB does not persist across deployments. For production, use one of:
1. **Turso** (libSQL, SQLite-compatible, persistent) — recommended
2. **Vercel Postgres** (if migrating away from SQLite)
3. **SQLite with volume mount** (requires Vercel Enterprise)

For local development and initial launch, SQLite is fine. Migrate to Turso when going to production.

---

## 10. Middleware & Guards

### 10.1 NextAuth Middleware

**File:** `apps/dashboard/src/middleware.ts`

```ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assignments/:path*',
    '/submissions/:path*',
    '/leaderboard/:path*',
    '/notifications/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
```

### 10.2 Server-Side Guards

```ts
// lib/permissions.ts
import { auth } from './auth';

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}
```

Used in:
- API routes: `await requireUser()` / `await requireAdmin()` at handler start
- Server components: same pattern
- Admin layout: `await requireAdmin()` to block non-admin access

---

**End of ARCHITECTURE.md**
