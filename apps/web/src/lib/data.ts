import { db, users, assignments, attendanceSessions, announcements, submissions, settings, eq, desc, sql } from '@itc/db';
import { DEFAULT_SHOWCASE_CONFIG, type ShowcaseConfig } from '@/lib/showcaseData';

export interface PublicStats {
  membersCount: number;
  assignmentsCount: number;
  meetingsCount: number;
  submissionsCount: number;
}

export interface MeetingPreview {
  id: string;
  meetingNo: number;
  title: string | null;
  date: string;
  notes: string | null;
}

export interface AnnouncementPreview {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  className: string | null;
  points: number;
  submissionsCount: number;
}

// Fallback seed data in case DB has no rows or is inaccessible
const FALLBACK_STATS: PublicStats = {
  membersCount: 36,
  assignmentsCount: 8,
  meetingsCount: 12,
  submissionsCount: 142,
};

const FALLBACK_MEETINGS: MeetingPreview[] = [
  {
    id: 'm-1',
    meetingNo: 9,
    title: 'Modern UI/UX Design System dengan Figma',
    date: '2026-10-15',
    notes: 'Lab Komputer 3 — Bawa aset mockup masing-masing',
  },
  {
    id: 'm-2',
    meetingNo: 10,
    title: 'Fullstack Next.js 14 App Router & REST API',
    date: '2026-10-22',
    notes: 'Lab RPL 1 — Konfigurasi Node.js & Git repo',
  },
  {
    id: 'm-3',
    meetingNo: 11,
    title: 'Deploy Production & CI/CD Pipeline Showcase',
    date: '2026-10-29',
    notes: 'Aula Gedung B — Presentasi proyek akhir tim',
  },
];

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Ahmad Fauzan', className: 'XII RPL 1', points: 340, submissionsCount: 8 },
  { rank: 2, name: 'Siti Rahmawati', className: 'XI RPL 2', points: 315, submissionsCount: 8 },
  { rank: 3, name: 'Budi Santoso', className: 'XII TKJ 1', points: 290, submissionsCount: 7 },
  { rank: 4, name: 'Nabila Putri', className: 'XI MM 1', points: 275, submissionsCount: 7 },
  { rank: 5, name: 'Rizky Pratama', className: 'XII RPL 2', points: 260, submissionsCount: 6 },
];

export async function getPublicStats(): Promise<PublicStats> {
  try {
    const [uCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [aCount] = await db.select({ count: sql<number>`count(*)` }).from(assignments);
    const [sCount] = await db.select({ count: sql<number>`count(*)` }).from(attendanceSessions);
    const [subCount] = await db.select({ count: sql<number>`count(*)` }).from(submissions);

    return {
      membersCount: Number(uCount?.count || 0) || FALLBACK_STATS.membersCount,
      assignmentsCount: Number(aCount?.count || 0) || FALLBACK_STATS.assignmentsCount,
      meetingsCount: Number(sCount?.count || 0) || FALLBACK_STATS.meetingsCount,
      submissionsCount: Number(subCount?.count || 0) || FALLBACK_STATS.submissionsCount,
    };
  } catch (error) {
    console.warn('Using fallback public stats:', error);
    return FALLBACK_STATS;
  }
}

export async function getUpcomingMeetings(limit = 3): Promise<MeetingPreview[]> {
  try {
    const list = await db
      .select({
        id: attendanceSessions.id,
        meetingNo: attendanceSessions.meetingNo,
        title: attendanceSessions.title,
        date: attendanceSessions.date,
        notes: attendanceSessions.notes,
      })
      .from(attendanceSessions)
      .orderBy(desc(attendanceSessions.meetingNo))
      .limit(limit);

    if (!list || list.length === 0) return FALLBACK_MEETINGS;
    return list;
  } catch (error) {
    console.warn('Using fallback meetings:', error);
    return FALLBACK_MEETINGS;
  }
}

export async function getPublicLeaderboard(limit = 5): Promise<LeaderboardEntry[]> {
  try {
    // Calculate total scores per user
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        className: users.className,
        totalScore: sql<number>`COALESCE(SUM(${submissions.score}), 0)`,
        count: sql<number>`COUNT(${submissions.id})`,
      })
      .from(users)
      .leftJoin(submissions, eq(users.id, submissions.userId))
      .where(eq(users.role, 'member'))
      .groupBy(users.id)
      .orderBy(sql`COALESCE(SUM(${submissions.score}), 0) DESC`)
      .limit(limit);

    if (!rows || rows.length === 0) return FALLBACK_LEADERBOARD;

    return rows.map((r, i) => ({
      rank: i + 1,
      name: r.name,
      className: r.className,
      points: Number(r.totalScore) || 0,
      submissionsCount: Number(r.count) || 0,
    }));
  } catch (error) {
    console.warn('Using fallback leaderboard:', error);
    return FALLBACK_LEADERBOARD;
  }
}

export async function getPublicShowcase(): Promise<ShowcaseConfig> {
  try {
    const record = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'showcase_config'))
      .get();

    if (!record || !record.value) {
      return DEFAULT_SHOWCASE_CONFIG;
    }

    const parsed: Partial<ShowcaseConfig> = JSON.parse(record.value);
    return {
      labProjects: Array.isArray(parsed.labProjects)
        ? parsed.labProjects.filter((p) => p.active !== false)
        : DEFAULT_SHOWCASE_CONFIG.labProjects,
      portfolioProjects: Array.isArray(parsed.portfolioProjects)
        ? parsed.portfolioProjects.filter((p) => p.active !== false)
        : DEFAULT_SHOWCASE_CONFIG.portfolioProjects,
      prestasiMembers: Array.isArray(parsed.prestasiMembers)
        ? parsed.prestasiMembers.filter((m) => m.active !== false)
        : DEFAULT_SHOWCASE_CONFIG.prestasiMembers,
    };
  } catch (error) {
    console.warn('Using fallback showcase config:', error);
    return DEFAULT_SHOWCASE_CONFIG;
  }
}
