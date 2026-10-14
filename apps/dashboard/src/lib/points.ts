import {
  db,
  users,
  submissions,
  attendanceRecords,
  attendanceSessions,
  assignments,
  eq,
  desc,
  sql,
} from '@itc/db';

export interface MemberPointsSummary {
  userId: string;
  name: string;
  username: string;
  className: string | null;
  totalPoints: number;
  submissionCount: number;
  onTimeCount: number;
  presentCount: number;
  totalSessions: number;
  attendanceRate: number;
  avgScore: number;
  rank: number;
}

export async function getMemberPoints(userId: string): Promise<{
  totalPoints: number;
  submissionCount: number;
  onTimeCount: number;
  presentCount: number;
  rank: number;
  totalMembers: number;
}> {
  const leaderboard = await getFullLeaderboard();
  const totalMembers = leaderboard.length;
  const userEntry = leaderboard.find((l) => l.userId === userId);

  if (userEntry) {
    return {
      totalPoints: userEntry.totalPoints,
      submissionCount: userEntry.submissionCount,
      onTimeCount: userEntry.onTimeCount,
      presentCount: userEntry.presentCount,
      rank: userEntry.rank,
      totalMembers,
    };
  }

  return {
    totalPoints: 0,
    submissionCount: 0,
    onTimeCount: 0,
    presentCount: 0,
    rank: totalMembers || 1,
    totalMembers,
  };
}

export async function getFullLeaderboard(): Promise<MemberPointsSummary[]> {
  try {
    const allMembers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        className: users.className,
      })
      .from(users)
      .where(eq(users.role, 'member'))
      .all();

    const allSubmissions = await db.select().from(submissions).all();
    const allAttendance = await db.select().from(attendanceRecords).all();
    const totalSessionsList = await db.select().from(attendanceSessions).all();
    const totalSessions = totalSessionsList.length || 1;

    const result: MemberPointsSummary[] = allMembers.map((member) => {
      const userSubs = allSubmissions.filter((s) => s.userId === member.id);
      const userAtt = allAttendance.filter(
        (a) => a.userId === member.id && a.status === 'present'
      );

      let subPoints = 0;
      let onTimeCount = 0;
      let gradedScoresSum = 0;
      let gradedCount = 0;

      for (const s of userSubs) {
        if (s.score !== null && s.score !== undefined) {
          // If graded, add the score directly
          subPoints += s.score;
          gradedScoresSum += s.score;
          gradedCount++;
        } else if (s.status === 'late') {
          subPoints += 5;
        } else {
          // On-time default pending
          subPoints += 10;
          onTimeCount++;
        }
      }

      const attPoints = userAtt.length * 5;
      const totalPoints = subPoints + attPoints;
      const avgScore = gradedCount > 0 ? Math.round(gradedScoresSum / gradedCount) : 0;
      const attendanceRate = Math.min(
        100,
        Math.round((userAtt.length / Math.max(1, totalSessions)) * 100)
      );

      return {
        userId: member.id,
        name: member.name,
        username: member.username,
        className: member.className,
        totalPoints,
        submissionCount: userSubs.length,
        onTimeCount,
        presentCount: userAtt.length,
        totalSessions,
        attendanceRate,
        avgScore,
        rank: 0,
      };
    });

    // Sort descending by totalPoints, then attendanceRate, then avgScore, then name
    result.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.attendanceRate !== a.attendanceRate) return b.attendanceRate - a.attendanceRate;
      if (b.avgScore !== a.avgScore) return b.avgScore - a.avgScore;
      return a.name.localeCompare(b.name);
    });

    // Assign rank
    result.forEach((item, index) => {
      item.rank = index + 1;
    });

    return result;
  } catch (error) {
    console.error('Error computing full leaderboard:', error);
    return [];
  }
}
