import React from 'react';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/permissions';
import { db, assignments, categories, submissions, users, eq, and } from '@itc/db';
import Link from 'next/link';
import { Clock, ArrowLeft, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import { AssignmentSubmitForm } from './AssignmentSubmitForm';

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const { id } = params;

  const [assignment, submission] = await Promise.all([
    db
      .select({
        id: assignments.id,
        title: assignments.title,
        description: assignments.description,
        deadline: assignments.deadline,
        maxScore: assignments.maxScore,
        status: assignments.status,
        createdAt: assignments.createdAt,
        categoryName: categories.name,
        categoryColor: categories.color,
      })
      .from(assignments)
      .leftJoin(categories, eq(assignments.categoryId, categories.id))
      .where(eq(assignments.id, id))
      .get(),
    db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, id), eq(submissions.userId, user.id)))
      .get(),
  ]);

  if (!assignment) {
    notFound();
  }

  const deadlineDate = new Date(assignment.deadline);
  const diffMs = deadlineDate.getTime() - Date.now();
  const isOverdue = diffMs < 0;

  let countdownText = 'Deadline telah lewat';
  if (!isOverdue) {
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownText = days > 0 ? `${days} Hari ${hours} Jam tersisa` : `${hours} Jam tersisa`;
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-text-3 hover:text-text-1 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>KEMBALI KE DAFTAR TUGAS</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-brand-soft text-brand font-bold border border-brand/20 rounded-none">
                {assignment.categoryName || 'TUGAS'}
              </span>
              <span className="font-mono text-xs text-text-3">
                MAX SCORE: {assignment.maxScore} PTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
              {assignment.title}
            </h1>
          </div>

          {/* Deadline Countdown Pill */}
          <div className="flex items-center gap-2 px-4 py-2 border border-hairline bg-surface rounded-none shrink-0">
            <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`} />
            <div className="font-mono text-xs">
              <div className="text-text-3 text-[9px] uppercase">STATUS WAKTU</div>
              <div className={`font-semibold ${isOverdue ? 'text-red-700' : 'text-text-1'}`}>
                {countdownText}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details on Left, Submission on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Specification & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-text-1 border-b border-hairline-soft pb-3">
              Deskripsi & Instruksi Pengerjaan
            </h2>

            <div className="text-sm text-text-2 leading-relaxed whitespace-pre-line space-y-3">
              {assignment.description || 'Tidak ada deskripsi detail tambahan.'}
            </div>

            <div className="pt-4 border-t border-hairline-soft grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-text-3 block text-[10px] uppercase">BATAS WAKTU</span>
                <span className="text-text-1 font-semibold">
                  {deadlineDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </span>
              </div>
              <div>
                <span className="text-text-3 block text-[10px] uppercase">STATUS PENGUMPULAN</span>
                <span className="text-text-1 font-semibold">
                  {submission ? 'SUDAH DIKUMPULKAN' : 'BELUM DIKUMPULKAN'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-text-1">Ketentuan Pengumpulan</h3>
            <ul className="text-xs text-text-2 space-y-2 list-disc list-inside">
              <li>Pastikan format file berupa archive (ZIP/RAR) atau dokumen PDF standar.</li>
              <li>Ukuran maksimum berkas yang diizinkan sistem adalah 100 MB.</li>
              <li>Jika menyertakan link repository GitHub, pastikan visibility repository bersifat Public.</li>
              <li>Kamu masih dapat memperbarui submisi sebelum batas waktu deadline berakhir.</li>
            </ul>
          </div>
        </div>

        {/* Right: Submission Form / Status */}
        <div className="lg:col-span-5">
          <AssignmentSubmitForm
            assignmentId={assignment.id}
            existingSubmission={submission}
            isOverdue={isOverdue}
          />
        </div>
      </div>
    </div>
  );
}
