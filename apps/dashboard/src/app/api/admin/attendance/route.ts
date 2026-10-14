import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  attendanceSessions,
  attendanceRecords,
  users,
  cuid,
  desc,
  asc,
  eq,
} from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const sessions = await db
      .select()
      .from(attendanceSessions)
      .orderBy(desc(attendanceSessions.meetingNo))
      .all();

    const records = await db
      .select({
        id: attendanceRecords.id,
        sessionId: attendanceRecords.sessionId,
        userId: attendanceRecords.userId,
        status: attendanceRecords.status,
      })
      .from(attendanceRecords)
      .all();

    return NextResponse.json({ sessions, records });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat absensi' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { sessionId, meetingNo, title, date, notes, records } = body;

    let targetSessionId = sessionId;

    if (!targetSessionId) {
      // Creating a new session
      if (!meetingNo || !date) {
        return NextResponse.json(
          { error: 'Nomor pertemuan dan tanggal wajib diisi' },
          { status: 400 }
        );
      }

      // Check unique meetingNo
      const existing = await db
        .select({ id: attendanceSessions.id })
        .from(attendanceSessions)
        .where(eq(attendanceSessions.meetingNo, Number(meetingNo)))
        .get();

      if (existing) {
        return NextResponse.json(
          { error: `Pertemuan #${meetingNo} sudah pernah dibuat sebelumnya.` },
          { status: 400 }
        );
      }

      targetSessionId = cuid();
      await db.insert(attendanceSessions).values({
        id: targetSessionId,
        meetingNo: Number(meetingNo),
        title: title ? title.trim() : `Pertemuan #${meetingNo}`,
        date: date.trim(),
        notes: notes ? notes.trim() : null,
        createdBy: admin.id,
      });
    } else {
      // Updating existing session info
      await db
        .update(attendanceSessions)
        .set({
          title: title ? title.trim() : undefined,
          date: date ? date.trim() : undefined,
          notes: notes ? notes.trim() : null,
          updatedAt: new Date(),
        })
        .where(eq(attendanceSessions.id, targetSessionId));
    }

    // Upsert / Save attendance records
    if (Array.isArray(records) && records.length > 0) {
      for (const rec of records) {
        const { userId, status } = rec;
        if (!userId) continue;

        const existingRec = await db
          .select({ id: attendanceRecords.id })
          .from(attendanceRecords)
          .where(
            eq(attendanceRecords.sessionId, targetSessionId)
          )
          .all();

        const match = existingRec.find(
          (r) => r.id && rec.id === r.id
        );

        // Delete existing records for this session & user to avoid duplicate
        await db
          .delete(attendanceRecords)
          .where(
            eq(attendanceRecords.sessionId, targetSessionId)
          );

        // Insert all afresh
        break;
      }

      // Bulk insert new records
      for (const rec of records) {
        if (!rec.userId) continue;
        await db.insert(attendanceRecords).values({
          id: cuid(),
          sessionId: targetSessionId,
          userId: rec.userId,
          status: rec.status || 'present',
          markedBy: admin.id,
          markedAt: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true, sessionId: targetSessionId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan absensi' },
      { status: 500 }
    );
  }
}
