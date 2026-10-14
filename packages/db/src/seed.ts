import { db } from './client';
import {
  users,
  categories,
  settings,
  attendanceSessions,
  announcements,
  assignments,
} from './schema';
import { cuid } from './id';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed...');

  // ── Admin account ──
  let existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.username, 'admin'))
    .get();

  let adminId = existingAdmin?.id;
  if (!existingAdmin) {
    adminId = cuid();
    const adminPassword = await bcrypt.hash('admin123', 12);
    await db.insert(users).values({
      id: adminId,
      name: 'Admin IT Club',
      username: 'admin',
      email: 'admin@itclub.smkn1.sch.id',
      passwordHash: adminPassword,
      role: 'admin',
      className: null,
      bio: 'Head Administrator & Curriculum Lead',
    });
  }

  // ── Default categories ──
  let catCodingRecord = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, 'coding'))
    .get();

  let catCoding = catCodingRecord?.id;
  if (!catCodingRecord) {
    catCoding = cuid();
    const catDesign = cuid();
    const catDocs = cuid();
    const catPres = cuid();

    await db.insert(categories).values([
      {
        id: catCoding,
        name: 'Coding',
        slug: 'coding',
        color: '#3D6FE0',
        sortOrder: 1,
      },
      {
        id: catDesign,
        name: 'Design',
        slug: 'design',
        color: '#8B5CF6',
        sortOrder: 2,
      },
      {
        id: catDocs,
        name: 'Documentation',
        slug: 'documentation',
        color: '#10B981',
        sortOrder: 3,
      },
      {
        id: catPres,
        name: 'Presentation',
        slug: 'presentation',
        color: '#F59E0B',
        sortOrder: 4,
      },
    ]);
  }

  // ── Default settings ──
  await db
    .insert(settings)
    .values([
      { key: 'site_title', value: JSON.stringify('IT Club SMKN 1 Surabaya') },
      {
        key: 'point_weights',
        value: JSON.stringify({
          on_time: 10,
          late: 5,
          missing: 0,
          attendance: 5,
        }),
      },
      { key: 'contact_email', value: JSON.stringify('itclub@smkn1.sch.id') },
      { key: 'contact_wa', value: JSON.stringify('0812-3456-7890') },
      { key: 'contact_ig', value: JSON.stringify('@itclubsmkn1') },
    ])
    .onConflictDoNothing();

  // ── Sample Upcoming Meetings ──
  if (adminId) {
    const existingSessions = await db.select().from(attendanceSessions).all();
    if (existingSessions.length === 0) {
      await db.insert(attendanceSessions).values([
        {
          id: cuid(),
          meetingNo: 1,
          title: 'Modern Web Engineering & Monorepo Architecture',
          date: '2026-10-15',
          notes: 'Lab Rekayasa Perangkat Lunak 2 (R204)',
          createdBy: adminId,
        },
        {
          id: cuid(),
          meetingNo: 2,
          title: 'Component Design Systems & Editorial Luxury UI',
          date: '2026-10-22',
          notes: 'Lab Multimedia 1 (M101)',
          createdBy: adminId,
        },
        {
          id: cuid(),
          meetingNo: 3,
          title: 'System Telemetry, SQLite Schema & Type-Safe APIs',
          date: '2026-10-29',
          notes: 'Lab Komputasi Awan (C302)',
          createdBy: adminId,
        },
      ]);
    }

    // ── Sample Announcements ──
    const existingAnnouncements = await db.select().from(announcements).all();
    if (existingAnnouncements.length === 0) {
      await db.insert(announcements).values([
        {
          id: cuid(),
          title: 'Peluncuran Portal Resmi IT Club 2026/2027',
          body: 'Selamat datang di portal submission dan pemantauan capaian IT Club SMKN 1 Surabaya. Mulai pertemuan minggu ini, seluruh pengumpulan tugas dan evaluasi kode dilakukan secara terpusat melalui sistem ini.',
          published: 1,
          pinned: 1,
          createdBy: adminId,
          publishedAt: new Date(),
        },
        {
          id: cuid(),
          title: 'Jadwal Boot Camp Pengembangan Full-Stack & UI/UX',
          body: 'Sesi intensif pemantapan fondasi JavaScript, TypeScript, Tailwind CSS, dan Drizzle ORM akan diselenggarakan setiap hari Kamis sore.',
          published: 1,
          pinned: 0,
          createdBy: adminId,
          publishedAt: new Date(Date.now() - 86400000 * 2),
        },
      ]);
    }

    // ── Sample Initial Assignment ──
    if (catCoding) {
      const existingAssignments = await db.select().from(assignments).all();
      if (existingAssignments.length === 0) {
        await db.insert(assignments).values([
          {
            id: cuid(),
            title: 'Tugas 01: Setup Lingkungan Kerja & Monorepo Architecture',
            description:
              'Inisialisasi workspace lokal dengan pnpm, konfigurasikan TypeScript strict mode, dan buat struktur monorepo Turborepo sesuai standar dokumentasi IT Club.',
            categoryId: catCoding,
            deadline: new Date(Date.now() + 86400000 * 5),
            maxScore: 100,
            status: 'published',
            createdBy: adminId,
          },
        ]);
      }
    }
  }

  console.log('✅ Seed complete');
  console.log('   Admin:  admin  / admin123');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
