import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  users,
  assignments,
  submissions,
  attendanceRecords,
  attendanceSessions,
  categories,
  eq,
  desc,
  asc,
} from '@itc/db';

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'members';

    if (type === 'members') {
      const allMembers = await db
        .select()
        .from(users)
        .where(eq(users.role, 'member'))
        .orderBy(asc(users.name))
        .all();

      const allSubmissions = await db.select().from(submissions).all();
      const allAttendance = await db.select().from(attendanceRecords).all();
      const allSessions = await db.select().from(attendanceSessions).all();

      const sessionCount = allSessions.length;

      const rows: string[] = [
        'name,username,class,submissions,avg_score,attendance_rate,total_points',
      ];

      for (const m of allMembers) {
        const userSubs = allSubmissions.filter((s) => s.userId === m.id);
        const gradedSubs = userSubs.filter((s) => s.score !== null && s.score !== undefined);
        const avgScore =
          gradedSubs.length > 0
            ? (
                gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                gradedSubs.length
              ).toFixed(1)
            : '0.0';

        const userAtt = allAttendance.filter((a) => a.userId === m.id && a.status === 'present');
        const attRate =
          sessionCount > 0 ? ((userAtt.length / sessionCount) * 100).toFixed(0) : '0';

        // Total points = sum of scores + attendance points (5 pts per session)
        const totalScore = userSubs.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const totalPts = totalScore + userAtt.length * 5;

        // Escape CSV values
        const cleanName = `"${(m.name || '').replace(/"/g, '""')}"`;
        const cleanUsername = `"${(m.username || '').replace(/"/g, '""')}"`;
        const cleanClass = `"${(m.className || '').replace(/"/g, '""')}"`;

        rows.push(
          `${cleanName},${cleanUsername},${cleanClass},${userSubs.length},${avgScore},${attRate}%,${totalPts}`
        );
      }

      const csvContent = rows.join('\r\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="rekap_anggota_itc_${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }

    if (type === 'assignments') {
      const allAssignments = await db
        .select({
          id: assignments.id,
          title: assignments.title,
          categoryName: categories.name,
          deadline: assignments.deadline,
          status: assignments.status,
        })
        .from(assignments)
        .leftJoin(categories, eq(assignments.categoryId, categories.id))
        .orderBy(desc(assignments.deadline))
        .all();

      const allSubmissions = await db.select().from(submissions).all();

      const rows: string[] = [
        'title,category,deadline,submissions,avg_score,on_time_rate',
      ];

      for (const a of allAssignments) {
        const subs = allSubmissions.filter((s) => s.assignmentId === a.id);
        const gradedSubs = subs.filter((s) => s.score !== null && s.score !== undefined);
        const avgScore =
          gradedSubs.length > 0
            ? (
                gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                gradedSubs.length
              ).toFixed(1)
            : '0.0';

        const onTimeSubs = subs.filter(
          (s) => new Date(s.submittedAt).getTime() <= new Date(a.deadline).getTime()
        );

        const onTimeRate =
          subs.length > 0 ? ((onTimeSubs.length / subs.length) * 100).toFixed(0) : '0';

        const cleanTitle = `"${(a.title || '').replace(/"/g, '""')}"`;
        const cleanCategory = `"${(a.categoryName || 'Umum').replace(/"/g, '""')}"`;
        const deadlineStr = new Date(a.deadline).toISOString().slice(0, 10);

        rows.push(
          `${cleanTitle},${cleanCategory},${deadlineStr},${subs.length},${avgScore},${onTimeRate}%`
        );
      }

      const csvContent = rows.join('\r\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="rekap_penugasan_itc_${new Date()
            .toISOString()
            .slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Tipe ekspor tidak valid' }, { status: 400 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal mengekspor laporan CSV' },
      { status: 500 }
    );
  }
}
