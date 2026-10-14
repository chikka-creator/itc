import React from 'react';
import { requireUser } from '@/lib/permissions';
import { db, submissions, assignments, categories, eq, desc } from '@itc/db';
import { SubmissionsClient } from './SubmissionsClient';

export default async function SubmissionsPage() {
  const user = await requireUser();

  const userSubmissions = await db
    .select({
      id: submissions.id,
      assignmentId: submissions.assignmentId,
      fileUrl: submissions.fileUrl,
      fileName: submissions.fileName,
      fileSize: submissions.fileSize,
      linkUrl: submissions.linkUrl,
      status: submissions.status,
      score: submissions.score,
      feedback: submissions.feedback,
      submittedAt: submissions.submittedAt,
      assignmentTitle: assignments.title,
      assignmentDeadline: assignments.deadline,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(submissions)
    .leftJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .leftJoin(categories, eq(assignments.categoryId, categories.id))
    .where(eq(submissions.userId, user.id))
    .orderBy(desc(submissions.submittedAt))
    .all();

  const formatted = userSubmissions.map((s) => {
    const isLate = s.assignmentDeadline
      ? new Date(s.submittedAt).getTime() > new Date(s.assignmentDeadline).getTime()
      : false;

    return {
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle: s.assignmentTitle || 'Tugas Ekskul',
      categoryName: s.categoryName || 'TUGAS',
      status: s.status,
      score: s.score,
      feedback: s.feedback,
      fileUrl: s.fileUrl,
      fileName: s.fileName,
      fileSize: s.fileSize,
      linkUrl: s.linkUrl,
      isLate,
      submittedAtStr: new Date(s.submittedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 mb-1.5">
          <span>• RIWAYAT & EVALUASI •</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Riwayat Pengumpulan Tugas
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          PANTAU STATUS PENILAIAN, CATATAN EVALUASI MENTOR, DAN SKOR CAPAIAN KAMU
        </p>
      </div>

      <SubmissionsClient submissions={formatted} />
    </div>
  );
}
