import React from 'react';
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
import { ReportsClient } from './ReportsClient';

export default async function AdminReportsPage() {
  await requireAdmin();

  const allMembers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'member'))
    .orderBy(asc(users.name))
    .all();

  const allAssignments = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      categoryName: categories.name,
      categoryColor: categories.color,
      deadline: assignments.deadline,
      maxScore: assignments.maxScore,
    })
    .from(assignments)
    .leftJoin(categories, eq(assignments.categoryId, categories.id))
    .orderBy(desc(assignments.deadline))
    .all();

  const allSubmissions = await db.select().from(submissions).all();
  const allAttendance = await db.select().from(attendanceRecords).all();
  const allSessions = await db.select().from(attendanceSessions).all();

  const totalSessions = allSessions.length;

  // Process Member performance rows
  const memberReport = allMembers.map((m) => {
    const userSubs = allSubmissions.filter((s) => s.userId === m.id);
    const gradedSubs = userSubs.filter((s) => s.score !== null && s.score !== undefined);
    const avgScore =
      gradedSubs.length > 0
        ? Math.round(
            gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedSubs.length
          )
        : 0;

    const userAtt = allAttendance.filter((a) => a.userId === m.id && a.status === 'present');
    const attRate =
      totalSessions > 0 ? Math.round((userAtt.length / totalSessions) * 100) : 0;

    const totalScore = userSubs.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const totalPoints = totalScore + userAtt.length * 5;

    return {
      id: m.id,
      name: m.name,
      username: m.username,
      className: m.className || 'Umum',
      submissionsCount: userSubs.length,
      avgScore,
      attendanceRate: attRate,
      totalPoints,
    };
  });

  // Process Assignment performance rows
  const assignmentReport = allAssignments.map((a) => {
    const subs = allSubmissions.filter((s) => s.assignmentId === a.id);
    const gradedSubs = subs.filter((s) => s.score !== null && s.score !== undefined);
    const avgScore =
      gradedSubs.length > 0
        ? Math.round(
            gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedSubs.length
          )
        : 0;

    const onTimeSubs = subs.filter(
      (s) => new Date(s.submittedAt).getTime() <= new Date(a.deadline).getTime()
    );

    const onTimeRate =
      subs.length > 0 ? Math.round((onTimeSubs.length / subs.length) * 100) : 0;

    return {
      id: a.id,
      title: a.title,
      categoryName: a.categoryName || 'Umum',
      categoryColor: a.categoryColor || '#7C8C6B',
      deadline: a.deadline,
      submissionsCount: subs.length,
      avgScore,
      onTimeRate,
    };
  });

  // Global KPI summary
  const totalSubmissionsCount = allSubmissions.length;
  const clubAvgScore =
    memberReport.length > 0
      ? Math.round(
          memberReport.reduce((acc, m) => acc + m.avgScore, 0) / memberReport.length
        )
      : 0;
  const clubAvgAttendance =
    memberReport.length > 0
      ? Math.round(
          memberReport.reduce((acc, m) => acc + m.attendanceRate, 0) / memberReport.length
        )
      : 0;

  return (
    <ReportsClient
      membersData={memberReport}
      assignmentsData={assignmentReport}
      summary={{
        totalMembers: allMembers.length,
        totalSubmissions: totalSubmissionsCount,
        avgScore: clubAvgScore,
        avgAttendance: clubAvgAttendance,
      }}
    />
  );
}
