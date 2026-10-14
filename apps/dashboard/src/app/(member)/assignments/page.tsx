import React from 'react';
import { requireUser } from '@/lib/permissions';
import { db, assignments, submissions, categories, eq, desc } from '@itc/db';
import { AssignmentsClient } from './AssignmentsClient';

export default async function AssignmentsPage() {
  const user = await requireUser();

  const [allAssignments, userSubmissions] = await Promise.all([
    db
      .select({
        id: assignments.id,
        title: assignments.title,
        description: assignments.description,
        deadline: assignments.deadline,
        maxScore: assignments.maxScore,
        categoryName: categories.name,
        categoryColor: categories.color,
      })
      .from(assignments)
      .leftJoin(categories, eq(assignments.categoryId, categories.id))
      .where(eq(assignments.status, 'published'))
      .orderBy(desc(assignments.deadline))
      .all(),
    db
      .select({
        id: submissions.id,
        assignmentId: submissions.assignmentId,
        status: submissions.status,
        score: submissions.score,
        submittedAt: submissions.submittedAt,
      })
      .from(submissions)
      .where(eq(submissions.userId, user.id))
      .all(),
  ]);

  const submissionsMap = new Map(
    userSubmissions.map((s) => [s.assignmentId, s])
  );

  const formattedAssignments = allAssignments.map((a) => {
    const sub = submissionsMap.get(a.id);
    const deadlineDate = new Date(a.deadline);
    const isOverdue = deadlineDate.getTime() < Date.now();

    return {
      id: a.id,
      title: a.title,
      description: a.description,
      deadline: a.deadline,
      deadlineStr: deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      maxScore: a.maxScore,
      categoryName: a.categoryName || 'TUGAS',
      isSubmitted: !!sub,
      isOverdue,
      submissionStatus: sub?.status || null,
      score: sub?.score ?? null,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 mb-1.5">
          <span>• KURIKULUM & PENUGASAN •</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Daftar Penugasan Ekskul
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          PILIH TUGAS UNTUK MELIHAT SPESIFIKASI DAN MENGUNGGAH BERKAS HASIL PENGERJAAN
        </p>
      </div>

      <AssignmentsClient assignments={formattedAssignments} />
    </div>
  );
}
