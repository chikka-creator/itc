# DEPLOY — Deployment Guide

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Target**: Vercel
**Apps**: `apps/web` (public landing), `apps/dashboard` (auth + submission)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Database Strategy](#2-database-strategy)
3. [Vercel Setup](#3-vercel-setup)
4. [Environment Variables](#4-environment-variables)
5. [Deployment Steps](#5-deployment-steps)
6. [Post-Deployment](#6-post-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20 LTS | Runtime |
| pnpm | ≥ 9.11 | Package manager |
| Vercel CLI | latest | Deployment (optional, can use dashboard) |
| Git | latest | Version control |

**Install pnpm globally:**
```bash
npm install -g pnpm@9.11.0
```

**Verify:**
```bash
node --version   # v20.x.x
pnpm --version   # 9.11.0
```

---

## 2. Database Strategy

### 2.1 Local Development
- SQLite file: `packages/db/data.db`
- Path: relative to `packages/db/`
- No setup needed — `pnpm db:push` creates the file

### 2.2 Production (Vercel)

**Problem:** Vercel serverless functions have ephemeral filesystem. SQLite file does NOT persist across deployments or function invocations.

**Solution:** Use **Turso** (libSQL) — SQLite-compatible, persistent, edge-optimized.

| Option | Pros | Cons |
|--------|------|------|
| **Turso** (recommended) | SQLite-compatible, persistent, free tier (9GB), edge-optimized | Requires migration to libSQL driver |
| Vercel Postgres | Native integration, generous free tier | Not SQLite — requires ORM changes |
| Vercel KV | Simple, fast | Not relational — requires schema redesign |
| SQLite + volume | No code changes | Requires Vercel Enterprise |

**Recommendation:** Start with SQLite locally, migrate to Turso for production.

### 2.3 Turso Setup (Production)

**Step 1: Install Turso CLI**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Step 2: Create database**
```bash
turso db create itc-portal
```

**Step 3: Get connection URL**
```bash
turso db show itc-portal --url
# Output: libsql://xxxxx.turso.io
```

**Step 4: Get auth token**
```bash
turso db tokens create itc-portal
# Output: eyJhbGciOi...
```

**Step 5: Install libSQL client**
```bash
pnpm add @libsql/client
```

**Step 6: Update `packages/db/src/client.ts`**
```ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const url = process.env.TURSO_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const client = createClient({ url, authToken });
export const db = drizzle(client, { schema });
```

**Step 7: Update `.env`**
```bash
# Remove: DATABASE_URL=./data.db
# Add:
TURSO_URL=libsql://xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

**Step 8: Push schema to Turso**
```bash
cd packages/db
pnpm drizzle-kit push
```

---

## 3. Vercel Setup

### 3.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub (recommended) or email

### 3.2 Import Repository
- Push code to GitHub/GitLab/Bitbucket
- In Vercel Dashboard: **Add New → Project**
- Select repository
- Vercel auto-detects monorepo with Turborepo

### 3.3 Project Settings

**Root Directory:** (leave empty — Turborepo handles this)

**Build Settings:**
| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `cd apps/web && pnpm build` or `cd apps/dashboard && pnpm build` |
| Output Directory | Auto-detected by Next.js |
| Install Command | `pnpm install` |

**Note:** Each app is a separate Vercel project.

---

## 4. Environment Variables

### 4.1 `apps/web` (Public Landing)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes (local) | `./data.db` | SQLite path (dev only) |
| `TURSO_URL` | Yes (prod) | `libsql://xxxx.turso.io` | Turso URL (prod) |
| `TURSO_AUTH_TOKEN` | Yes (prod) | `eyJ...` | Turso token (prod) |

**Note:** `apps/web` reads data directly from DB. No NextAuth needed.

### 4.2 `apps/dashboard` (Auth + Submission)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes (local) | `./data.db` | SQLite path (dev only) |
| `TURSO_URL` | Yes (prod) | `libsql://xxxx.turso.io` | Turso URL (prod) |
| `TURSO_AUTH_TOKEN` | Yes (prod) | `eyJ...` | Turso token (prod) |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` | NextAuth JWT secret |
| `AUTH_URL` | Auto | `http://localhost:3000` | Base URL (auto-set by Vercel) |
| `BLOB_READ_WRITE_TOKEN` | Auto | `vercel_blob_rw_...` | Auto-set when Blob linked |

**Generate `AUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 4.3 Vercel Dashboard Setup

1. Go to **Project → Settings → Environment Variables**
2. Add variables from §4.1 / §4.2
3. Select environments: **Production**, **Preview**, **Development**
4. Click **Save**

---

## 5. Deployment Steps

### 5.1 Deploy `apps/web`

**Step 1: Create Vercel project**
- Dashboard → **Add New → Project**
- Select repo
- **Root Directory:** `apps/web`
- Click **Deploy**

**Step 2: Add environment variables**
- Go to **Settings → Environment Variables**
- Add `DATABASE_URL` (dev) or `TURSO_URL` + `TURSO_AUTH_TOKEN` (prod)
- Redeploy

**Step 3: Custom domain (optional)**
- Go to **Settings → Domains**
- Add `itclub.smkn1.sch.id` or your domain

### 5.2 Deploy `apps/dashboard`

**Step 1: Create Vercel project**
- Dashboard → **Add New → Project**
- Select repo
- **Root Directory:** `apps/dashboard`
- Click **Deploy**

**Step 2: Add environment variables**
- Go to **Settings → Environment Variables**
- Add all variables from §4.2
- Redeploy

**Step 3: Link Vercel Blob**
- Go to **Storage → Create Database → Blob**
- Select region closest to Surabaya (Singapore: `sin1`)
- Vercel auto-sets `BLOB_READ_WRITE_TOKEN`

**Step 4: Custom domain (optional)**
- Go to **Settings → Domains**
- Add `dashboard.itclub.smkn1.sch.id` or your domain

### 5.3 Verify Deployment

**Checklist:**
- [ ] `apps/web` loads without errors
- [ ] `apps/dashboard` redirects to `/login`
- [ ] Admin can login with seed credentials
- [ ] Database queries work (leaderboard, announcements)
- [ ] File upload works (if Blob linked)
- [ ] No console errors in browser

---

## 6. Post-Deployment

### 6.1 Seed Production Database

**If using Turso:**
```bash
cd packages/db
TURSO_URL=libsql://xxxx.turso.io TURSO_AUTH_TOKEN=eyJ... pnpm db:push
TURSO_URL=libsql://xxxx.turso.io TURSO_AUTH_TOKEN=eyJ... pnpm db:seed
```

**If using SQLite (not recommended for prod):**
```bash
cd packages/db
pnpm drizzle-kit push
pnpm db:seed
```

### 6.2 Change Admin Password

1. Login to `apps/dashboard` with `admin / admin123`
2. Go to **Settings → Change Password**
3. Set strong password
4. Save

### 6.3 Create Initial Content

1. Login as admin
2. Go to **Admin → Categories** → add categories
3. Go to **Admin → Announcements** → publish welcome announcement
4. Go to **Admin → Users** → add all members
5. Go to **Admin → Assignments** → create first assignment
6. Go to **Admin → Gallery** → upload photos
7. Go to **Admin → Attendance** → create first meeting session

### 6.4 Distribute Credentials

- Share `apps/dashboard` URL with members
- Provide each member their username + temporary password
- Instruct them to change password on first login

---

## 7. Troubleshooting

### 7.1 Build Fails

| Error | Solution |
|-------|----------|
| `Cannot find module '@itc/db'` | Run `pnpm install` at root |
| `Cannot find module 'next-auth'` | Run `pnpm install` at root |
| `Type error` | Run `pnpm typecheck` at root |
| `Build timeout` | Vercel free tier has 60s limit; optimize build |

### 7.2 Database Errors

| Error | Solution |
|-------|----------|
| `no such table` | Run `pnpm drizzle-kit push` |
| `database is locked` | SQLite concurrency issue; use WAL mode or migrate to Turso |
| `file not found` | Check `DATABASE_URL` path |
| `Turso connection failed` | Verify `TURSO_URL` and `TURSO_AUTH_TOKEN` |

### 7.3 Auth Errors

| Error | Solution |
|-------|----------|
| `Invalid credentials` | Check username/password in seed |
| `Session expired` | Check `AUTH_SECRET` is set |
| `AUTH_URL mismatch` | Set `AUTH_URL` to exact domain (no trailing slash) |
| `Redirect loop` | Clear cookies, check middleware config |

### 7.4 Blob Upload Errors

| Error | Solution |
|-------|----------|
| `BLOB_READ_WRITE_TOKEN not set` | Link Blob storage in Vercel dashboard |
| `File too large` | Max 100MB; enforce client-side check |
| `Upload timeout` | Large files may timeout; suggest link URL instead |

### 7.5 Performance Issues

| Issue | Solution |
|-------|----------|
| Slow DB queries | Add indexes (see SCHEMA.md §5) |
| Slow page load | Use ISR for landing, optimize images |
| Cold start delay | Use Turso edge functions, reduce bundle size |

---

## 8. Rollback Strategy

### 8.1 Vercel Rollback
- Go to **Deployments** in Vercel dashboard
- Find previous working deployment
- Click **... → Promote to Production**

### 8.2 Database Rollback
- **SQLite:** Restore from backup file
- **Turso:** Use `turso db restore` with snapshot

### 8.3 Backup Schedule

| Data | Frequency | Method |
|------|-----------|--------|
| SQLite file (dev) | Daily | `cp data.db data.db.backup` |
| Turso database | Automatic | Turso auto-backups |
| Blob files | Automatic | Vercel Blob replication |

---

**End of DEPLOY.md**
