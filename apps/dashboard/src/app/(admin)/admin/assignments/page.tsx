import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  assignments,
  categories,
  submissions,
  desc,
  eq,
  count,
} from '@itc/db';
import { AssignmentsAdminClient } from './AssignmentsAdminClient';

export default async function AdminAssignmentsPage() {
  await requireAdmin();

  const allAssignments = await db
    .select({
      id: assignments.id,
      title: assignments.title,
      description: assignments.description,
      categoryId: assignments.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      deadline: assignments.deadline,
      maxScore: assignments.maxScore,
      status: assignments.status,
      createdAt: assignments.createdAt,
    })
    .from(assignments)
    .leftJoin(categories, eq(assignments.categoryId, categories.id))
    .orderBy(desc(assignments.createdAt))
    .all();

  const allCategories = await db.select().from(categories).all();

  // Fetch count of submissions per assignment
  const subCounts = await db
    .select({
      assignmentId: submissions.assignmentId,
      count: count(submissions.id),
    })
    .from(submissions)
    .groupBy(submissions.assignmentId)
    .all();

  const countMap: Record<string, number> = {};
  for (const sc of subCounts) {
    countMap[sc.assignmentId] = sc.count;
  }

  const assignmentsWithSubCount = allAssignments.map((a) => ({
    ...a,
    submissionsCount: countMap[a.id] || 0,
  }));

  return (
    <AssignmentsAdminClient
      initialAssignments={assignmentsWithSubCount}
      categories={allCategories}
    />
  );
}
