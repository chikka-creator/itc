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
