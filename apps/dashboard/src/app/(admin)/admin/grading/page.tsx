import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  submissions,
  assignments,
  users,
  categories,
  desc,
  eq,
} from '@itc/db';
import { GradingClient } from './GradingClient';

export default async function AdminGradingPage() {
  await requireAdmin();

  const allSubmissions = await db
    .select({
      id: submissions.id,
      assignmentId: submissions.assignmentId,
      assignmentTitle: assignments.title,
      assignmentDeadline: assignments.deadline,
      assignmentMaxScore: assignments.maxScore,
      categoryName: categories.name,
      categoryColor: categories.color,
      userId: submissions.userId,
      userName: users.name,
      userUsername: users.username,
      userClass: users.className,
      fileUrl: submissions.fileUrl,
      fileName: submissions.fileName,
      fileSize: submissions.fileSize,
      linkUrl: submissions.linkUrl,
      status: submissions.status,
      score: submissions.score,
      feedback: submissions.feedback,
      submittedAt: submissions.submittedAt,
      gradedAt: submissions.gradedAt,
    })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .innerJoin(users, eq(submissions.userId, users.id))
    .leftJoin(categories, eq(assignments.categoryId, categories.id))
    .orderBy(desc(submissions.submittedAt))
    .all();

  return <GradingClient initialSubmissions={allSubmissions} />;
}
