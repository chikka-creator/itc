import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  attendanceSessions,
  attendanceRecords,
  users,
  desc,
  asc,
  eq,
} from '@itc/db';
import { AttendanceClient } from './AttendanceClient';

export default async function AdminAttendancePage() {
  await requireAdmin();

  const sessions = await db
    .select()
    .from(attendanceSessions)
    .orderBy(desc(attendanceSessions.meetingNo))
    .all();

  const records = await db.select().from(attendanceRecords).all();

  const members = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      className: users.className,
    })
    .from(users)
    .where(eq(users.role, 'member'))
    .orderBy(asc(users.name))
    .all();

  return (
    <AttendanceClient
      initialSessions={sessions}
      initialRecords={records}
      members={members}
    />
  );
}
