# SCHEMA — Database Schema

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Engine**: SQLite 3 via `better-sqlite3`
**ORM**: Drizzle ORM (`drizzle-orm` + `drizzle-orm/better-sqlite3`)
**Migrations**: `drizzle-kit` (generate + push)

---

## Table of Contents

1. [Design Decisions](#1-design-decisions)
2. [Entity-Relationship Overview](#2-entity-relationship-overview)
3. [Full Drizzle Schema](#3-full-drizzle-schema)
4. [Table Reference](#4-table-reference)
5. [Indexes](#5-indexes)
6. [Foreign Keys & Cascade Rules](#6-foreign-keys--cascade-rules)
7. [Data Types & Conventions](#7-data-types--conventions)
8. [Migrations](#8-migrations)
9. [Seed Data](#9-seed-data)

---

## 1. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary keys | `text` (CUID v2) | URL-safe, no sequence collision, works in distributed future |
| Timestamps | `integer` epoch **milliseconds** (`mode: 'timestamp_ms'`) | Precision, sortable, JS `Date` native |
| Booleans | `integer` 0/1 | SQLite has no native boolean |
| Enums | `text` + CHECK constraint | SQLite has no enum type; CHECK enforces at DB level |
| Soft delete | `status` column (`draft`/`published`/`archived`) | Preserve history, enable restore |
| Single submission per assignment | UNIQUE `(assignment_id, user_id)` | One submission row per member per assignment |
| NextAuth sessions | JWT (no DB table) | Credentials provider → stateless session, no adapter tables |
| Foreign keys | `PRAGMA foreign_keys = ON` | Enforced at connection level (better-sqlite3 default ON) |

---

## 2. Entity-Relationship Overview

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   categories │       │   assignments    │       │    users     │
│──────────────│       │──────────────────│       │──────────────│
│ id (PK)      │──┐    │ id (PK)          │    ┌──│ id (PK)      │
│ name         │  └───<│ category_id (FK) │    │  │ username     │
│ slug (UQ)    │       │ title            │    │  │ role         │
└──────────────┘       │ deadline         │    │  │ class        │
                       │ max_score        │    │  │ password_hash│
┌──────────────┐       │ status           │    │  └──────────────┘
│  submissions │       │ created_by (FK)──┼────┘
│──────────────│       └──────────────────┘
│ id (PK)      │──┐             │
│ assignment_id│<─┘             │
│ user_id (FK) │<───────────────┼──────────────┐
│ file_url     │                │              │
│ link_url     │                │              │
│ status       │                │              │
│ score        │                │              │
│ graded_by────┼────────────────┘              │
│ submitted_at │                               │
└──────────────┘                               │
                                               │
┌──────────────────────┐    ┌──────────────────┴──┐
│ attendance_sessions  │    │   notifications      │
│──────────────────────│    │──────────────────────│
│ id (PK)              │    │ id (PK)              │
│ meeting_no (UQ)      │    │ user_id (FK, null)   │
│ date                 │    │ title                │
│ created_by (FK)──────┼───>│ type                 │
└──────────────────────┘    │ read                 │
         │                  │ created_at           │
         │                  └──────────────────────┘
         │
┌──────────────────────┐
│ attendance_records   │
│──────────────────────│
│ id (PK)              │
│ session_id (FK)      │
│ user_id (FK)         │
│ status               │
│ marked_by (FK)       │
└──────────────────────┘

┌──────────────┐       ┌──────────────┐
│ announcements│       │   gallery    │
│──────────────│       │──────────────│
│ id (PK)      │       │ id (PK)      │
│ title        │       │ image_url    │
│ body         │       │ caption      │
│ published    │       │ sort_order   │
│ created_by   │       │ uploaded_by  │
└──────────────┘       └──────────────┘

┌──────────────┐
│   settings   │
│──────────────│
│ key (PK)     │
│ value        │
└──────────────┘
```

---

## 3. Full Drizzle Schema

**File:** `packages/db/src/schema.ts`

```ts
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull(),
    email: text('email'),
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: ['admin', 'member'] })
      .notNull()
      .default('member'),
    className: text('class_name'),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    lastLoginAt: integer('last_login_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    usernameUq: uniqueIndex('users_username_uq').on(t.username),
    emailUq: uniqueIndex('users_email_uq').on(t.email),
    roleIdx: index('users_role_idx').on(t.role),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    color: text('color'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    slugUq: uniqueIndex('categories_slug_uq').on(t.slug),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// ASSIGNMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const assignments = sqliteTable(
  'assignments',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    deadline: integer('deadline', { mode: 'timestamp_ms' }).notNull(),
    maxScore: integer('max_score').notNull().default(100),
    status: text('status', { enum: ['draft', 'published', 'archived'] })
      .notNull()
      .default('published'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    categoryIdx: index('assignments_category_idx').on(t.categoryId),
    deadlineIdx: index('assignments_deadline_idx').on(t.deadline),
    statusIdx: index('assignments_status_idx').on(t.status),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// SUBMISSIONS
// ─────────────────────────────────────────────────────────────────────────────
export const submissions = sqliteTable(
  'submissions',
  {
    id: text('id').primaryKey(),
    assignmentId: text('assignment_id')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fileUrl: text('file_url'),
    fileName: text('file_name'),
    fileSize: integer('file_size'),
    linkUrl: text('link_url'),
    status: text('status', {
      enum: ['pending', 'accepted', 'rejected', 'late', 'missing', 'graded'],
    })
      .notNull()
      .default('pending'),
    score: integer('score'),
    feedback: text('feedback'),
    gradedBy: text('graded_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    gradedAt: integer('graded_at', { mode: 'timestamp_ms' }),
    submittedAt: integer('submitted_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    assignmentIdx: index('submissions_assignment_idx').on(t.assignmentId),
    userIdx: index('submissions_user_idx').on(t.userId),
    statusIdx: index('submissions_status_idx').on(t.status),
    userAssignmentUq: uniqueIndex('submissions_user_assignment_uq').on(
      t.userId,
      t.assignmentId
    ),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE SESSIONS
// ─────────────────────────────────────────────────────────────────────────────
export const attendanceSessions = sqliteTable(
  'attendance_sessions',
  {
    id: text('id').primaryKey(),
    meetingNo: integer('meeting_no').notNull(),
    title: text('title'),
    date: text('date').notNull(), // ISO YYYY-MM-DD
    notes: text('notes'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    meetingNoUq: uniqueIndex('attendance_sessions_meeting_no_uq').on(
      t.meetingNo
    ),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE RECORDS
// ─────────────────────────────────────────────────────────────────────────────
export const attendanceRecords = sqliteTable(
  'attendance_records',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id')
      .notNull()
      .references(() => attendanceSessions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['present', 'absent', 'excused'] })
      .notNull()
      .default('present'),
    markedBy: text('marked_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    markedAt: integer('marked_at', { mode: 'timestamp_ms' }).$defaultFn(
      () => new Date()
    ),
  },
  (t) => ({
    sessionIdx: index('attendance_records_session_idx').on(t.sessionId),
    userIdx: index('attendance_records_user_idx').on(t.userId),
    sessionUserUq: uniqueIndex('attendance_records_session_user_uq').on(
      t.sessionId,
      t.userId
    ),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const announcements = sqliteTable(
  'announcements',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    published: integer('published').notNull().default(0),
    pinned: integer('pinned').notNull().default(0),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    publishedIdx: index('announcements_published_idx').on(t.published),
    createdAtIdx: index('announcements_created_at_idx').on(t.createdAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const notifications = sqliteTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    title: text('title').notNull(),
    body: text('body'),
    type: text('type', {
      enum: ['info', 'assignment', 'deadline', 'grade', 'announcement'],
    })
      .notNull()
      .default('info'),
    read: integer('read').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    userReadIdx: index('notifications_user_read_idx').on(t.userId, t.read),
    createdIdx: index('notifications_created_idx').on(t.createdAt),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────────────────────
export const gallery = sqliteTable(
  'gallery',
  {
    id: text('id').primaryKey(),
    imageUrl: text('image_url').notNull(),
    caption: text('caption'),
    sortOrder: integer('sort_order').notNull().default(0),
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    sortIdx: index('gallery_sort_idx').on(t.sortOrder),
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(), // JSON-encoded string
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type AttendanceSession = typeof attendanceSessions.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type GalleryImage = typeof gallery.$inferSelect;
export type Setting = typeof settings.$inferSelect;
```

---

## 4. Table Reference

### 4.1 `users`

Accounts for both admins and members. Created manually by an admin (no self-registration).

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 primary key |
| `name` | text | no | — | Full display name |
| `username` | text | no | — | Login username, unique, lowercase |
| `email` | text | yes | — | Optional, unique |
| `password_hash` | text | no | — | bcrypt hash (cost 12) |
| `role` | text | no | `'member'` | `'admin'` \| `'member'` |
| `class_name` | text | yes | — | e.g. `XII RPL 1` |
| `phone` | text | yes | — | Optional contact |
| `avatar_url` | text | yes | — | Image URL |
| `bio` | text | yes | — | Short description |
| `last_login_at` | timestamp_ms | yes | — | Set on successful login |
| `created_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

### 4.2 `categories`

Assignment categories (coding, design, documentation, etc.).

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `name` | text | no | — | e.g. `Coding`, `Design` |
| `slug` | text | no | — | URL-safe, unique |
| `description` | text | yes | — | |
| `color` | text | yes | — | Hex color for category dot |
| `sort_order` | integer | no | `0` | Display order |
| `created_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

### 4.3 `assignments`

Tasks given by admin each meeting.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `title` | text | no | — | |
| `description` | text | yes | — | Markdown supported |
| `category_id` | text | no | — | FK → categories.id |
| `deadline` | timestamp_ms | no | — | Submission cutoff |
| `max_score` | integer | no | `100` | Maximum score |
| `status` | text | no | `'published'` | `draft` \| `published` \| `archived` |
| `created_by` | text | no | — | FK → users.id (admin) |
| `created_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

### 4.4 `submissions`

One row per member per assignment. Contains file upload and/or link URL.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `assignment_id` | text | no | — | FK → assignments.id |
| `user_id` | text | no | — | FK → users.id |
| `file_url` | text | yes | — | Vercel Blob URL |
| `file_name` | text | yes | — | Original filename |
| `file_size` | integer | yes | — | Bytes |
| `link_url` | text | yes | — | External URL (GitHub, Drive, etc.) |
| `status` | text | no | `'pending'` | `pending` \| `accepted` \| `rejected` \| `late` \| `missing` \| `graded` |
| `score` | integer | yes | — | Admin-assigned score |
| `feedback` | text | yes | — | Admin feedback |
| `graded_by` | text | yes | — | FK → users.id |
| `graded_at` | timestamp_ms | yes | — | |
| `submitted_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

**Constraint:** `UNIQUE (assignment_id, user_id)` — one submission per member per assignment.

### 4.5 `attendance_sessions`

One row per meeting/pertemuan.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `meeting_no` | integer | no | — | Meeting number, unique |
| `title` | text | yes | — | e.g. `PHP Basics` |
| `date` | text | no | — | ISO `YYYY-MM-DD` |
| `notes` | text | yes | — | |
| `created_by` | text | no | — | FK → users.id |
| `created_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

### 4.6 `attendance_records`

Attendance per member per session.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `session_id` | text | no | — | FK → attendance_sessions.id |
| `user_id` | text | no | — | FK → users.id |
| `status` | text | no | `'present'` | `present` \| `absent` \| `excused` |
| `marked_by` | text | yes | — | FK → users.id (admin who marked) |
| `marked_at` | timestamp_ms | no | now | |

**Constraint:** `UNIQUE (session_id, user_id)` — one record per member per session.

### 4.7 `announcements`

Public announcements.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `title` | text | no | — | |
| `body` | text | no | — | Markdown |
| `published` | integer | no | `0` | 0 = draft, 1 = published |
| `pinned` | integer | no | `0` | 0 = normal, 1 = pinned to top |
| `created_by` | text | no | — | FK → users.id |
| `published_at` | timestamp_ms | yes | — | Set when published |
| `created_at` | timestamp_ms | no | now | |
| `updated_at` | timestamp_ms | no | now | |

### 4.8 `notifications`

In-app notifications. `user_id` null = broadcast to all users.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `user_id` | text | yes | — | FK → users.id; null = broadcast |
| `title` | text | no | — | |
| `body` | text | yes | — | |
| `type` | text | no | `'info'` | `info` \| `assignment` \| `deadline` \| `grade` \| `announcement` |
| `read` | integer | no | `0` | 0 = unread, 1 = read |
| `created_at` | timestamp_ms | no | now | |

### 4.9 `gallery`

Gallery images.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `id` | text | no | — | CUID v2 |
| `image_url` | text | no | — | Vercel Blob URL |
| `caption` | text | yes | — | |
| `sort_order` | integer | no | `0` | Display order |
| `uploaded_by` | text | no | — | FK → users.id |
| `created_at` | timestamp_ms | no | now | |

### 4.10 `settings`

Key-value store for site configuration.

| Column | Type | Null | Default | Notes |
|--------|------|------|---------|-------|
| `key` | text | no | — | Primary key |
| `value` | text | no | — | JSON-encoded value |
| `updated_at` | timestamp_ms | no | now | |

**Default settings keys:**

| Key | Value (JSON) | Description |
|-----|--------------|-------------|
| `site_title` | `"IT Club SMKN 1 Surabaya"` | Site name |
| `point_weights` | `{"on_time": 10, "late": 5, "missing": 0, "attendance": 5}` | Ranking point weights |
| `contact_email` | `"itclub@smkn1.sch.id"` | Contact email |
| `contact_wa` | `"0812-3456-7890"` | Contact WhatsApp |
| `contact_ig` | `"@itclubsmkn1"` | Instagram handle |

---

## 5. Indexes

All indexes are defined inline in the Drizzle schema (see §3). Summary:

| Table | Index Name | Columns | Type |
|-------|------------|---------|------|
| `users` | `users_username_uq` | `username` | UNIQUE |
| `users` | `users_email_uq` | `email` | UNIQUE |
| `users` | `users_role_idx` | `role` | INDEX |
| `categories` | `categories_slug_uq` | `slug` | UNIQUE |
| `assignments` | `assignments_category_idx` | `category_id` | INDEX |
| `assignments` | `assignments_deadline_idx` | `deadline` | INDEX |
| `assignments` | `assignments_status_idx` | `status` | INDEX |
| `submissions` | `submissions_assignment_idx` | `assignment_id` | INDEX |
| `submissions` | `submissions_user_idx` | `user_id` | INDEX |
| `submissions` | `submissions_status_idx` | `status` | INDEX |
| `submissions` | `submissions_user_assignment_uq` | `(user_id, assignment_id)` | UNIQUE |
| `attendance_sessions` | `attendance_sessions_meeting_no_uq` | `meeting_no` | UNIQUE |
| `attendance_records` | `attendance_records_session_idx` | `session_id` | INDEX |
| `attendance_records` | `attendance_records_user_idx` | `user_id` | INDEX |
| `attendance_records` | `attendance_records_session_user_uq` | `(session_id, user_id)` | UNIQUE |
| `announcements` | `announcements_published_idx` | `published` | INDEX |
| `announcements` | `announcements_created_at_idx` | `created_at` | INDEX |
| `notifications` | `notifications_user_read_idx` | `(user_id, read)` | INDEX |
| `notifications` | `notifications_created_idx` | `created_at` | INDEX |
| `gallery` | `gallery_sort_idx` | `sort_order` | INDEX |

---

## 6. Foreign Keys & Cascade Rules

| FK | From | To | On Delete | Reason |
|----|------|-----|-----------|--------|
| `assignments.category_id` | assignments | categories | `RESTRICT` | Cannot delete category with assignments |
| `assignments.created_by` | assignments | users | `RESTRICT` | Cannot delete admin who created assignments |
| `submissions.assignment_id` | submissions | assignments | `CASCADE` | Deleting assignment removes its submissions |
| `submissions.user_id` | submissions | users | `CASCADE` | Deleting user removes their submissions |
| `submissions.graded_by` | submissions | users | `SET NULL` | Keep submission if grader deleted |
| `attendance_sessions.created_by` | attendance_sessions | users | `RESTRICT` | |
| `attendance_records.session_id` | attendance_records | attendance_sessions | `CASCADE` | |
| `attendance_records.user_id` | attendance_records | users | `CASCADE` | |
| `attendance_records.marked_by` | attendance_records | users | `SET NULL` | |
| `announcements.created_by` | announcements | users | `RESTRICT` | |
| `notifications.user_id` | notifications | users | `CASCADE` | |
| `gallery.uploaded_by` | gallery | users | `RESTRICT` | |

---

## 7. Data Types & Conventions

| Convention | Detail |
|------------|--------|
| Primary keys | CUID v2 (`cuid` npm package), 24-char string |
| Timestamps | `integer` mode `timestamp_ms`, stored as Unix epoch milliseconds |
| Booleans | `integer` 0/1 |
| Enums | `text` with CHECK constraint (Drizzle `enum` type) |
| JSON | Stored as `text`, parsed at application layer |
| Foreign keys | `PRAGMA foreign_keys = ON` (better-sqlite3 default) |
| Column naming | `snake_case` in DB, `camelCase` in Drizzle (auto-mapped) |
| Timestamps auto-update | Application sets `updatedAt` on update; no DB trigger |

---

## 8. Migrations

### 8.1 Generate Migration

```bash
cd packages/db
pnpm drizzle-kit generate
```

This creates a new migration file in `packages/db/migrations/` with a timestamp prefix.

### 8.2 Push to Database (Dev)

```bash
cd packages/db
pnpm drizzle-kit push
```

### 8.3 Run Migrations (Production)

```bash
cd packages/db
pnpm drizzle-kit migrate
```

### 8.4 Reset Database (Dev Only)

```bash
rm packages/db/*.sqlite
pnpm drizzle-kit push
pnpm db:seed
```

---

## 9. Seed Data

**File:** `packages/db/src/seed.ts`

```ts
import { db } from './client';
import { users, categories, settings } from './schema';
import { cuid } from 'cuid'; // or custom cuid2
import bcrypt from 'bcrypt';

async function seed() {
  // ── Admin account ──
  const adminPassword = await bcrypt.hash('admin123', 12);
  await db.insert(users).values({
    id: cuid(),
    name: 'Admin IT Club',
    username: 'admin',
    passwordHash: adminPassword,
    role: 'admin',
    className: null,
  });

  // ── Default categories ──
  await db.insert(categories).values([
    { id: cuid(), name: 'Coding', slug: 'coding', color: '#3D6FE0', sortOrder: 1 },
    { id: cuid(), name: 'Design', slug: 'design', color: '#8B5CF6', sortOrder: 2 },
    { id: cuid(), name: 'Documentation', slug: 'documentation', color: '#10B981', sortOrder: 3 },
    { id: cuid(), name: 'Presentation', slug: 'presentation', color: '#F59E0B', sortOrder: 4 },
  ]);

  // ── Default settings ──
  await db.insert(settings).values([
    { key: 'site_title', value: JSON.stringify('IT Club SMKN 1 Surabaya') },
    { key: 'point_weights', value: JSON.stringify({ on_time: 10, late: 5, missing: 0, attendance: 5 }) },
    { key: 'contact_email', value: JSON.stringify('itclub@smkn1.sch.id') },
    { key: 'contact_wa', value: JSON.stringify('0812-3456-7890') },
    { key: 'contact_ig', value: JSON.stringify('@itclubsmkn1') },
  ]);

  console.log('✅ Seed complete');
  console.log('   Admin: admin / admin123');
}

seed();
```

**Run:**
```bash
cd packages/db
pnpm db:seed
```

---

**End of SCHEMA.md**
