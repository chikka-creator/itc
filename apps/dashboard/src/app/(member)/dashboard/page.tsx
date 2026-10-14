import React from 'react';
import { requireUser } from '@/lib/permissions';
import { db, assignments, submissions, categories, users, eq, desc } from '@itc/db';
import { getMemberPoints } from '@/lib/points';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Trophy,
  ArrowRight,
  FileCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default async function MemberDashboardPage() {
  const user = await requireUser();

  // Fetch full user record & points
  const [fullUser, userPointsSummary, activeAssignments, ownSubmissions] =
    await Promise.all([
      db.select().from(users).where(eq(users.id, user.id)).get(),
      getMemberPoints(user.id),
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
          fileUrl: submissions.fileUrl,
          fileName: submissions.fileName,
          linkUrl: submissions.linkUrl,
          submittedAt: submissions.submittedAt,
          assignmentTitle: assignments.title,
        })
        .from(submissions)
        .leftJoin(assignments, eq(submissions.assignmentId, assignments.id))
        .where(eq(submissions.userId, user.id))
        .orderBy(desc(submissions.submittedAt))
        .all(),
    ]);

  // Determine submission status map for assignments
  const submittedAssignmentIds = new Set(ownSubmissions.map((s) => s.assignmentId));

  // Find next nearest deadline that user hasn't submitted yet
  const unsubmittedAssignments = activeAssignments.filter(
    (a) => !submittedAssignmentIds.has(a.id)
  );

  let nextDeadlineText = 'Semua Selesai';
  let nextDeadlineAssignmentTitle = 'Tidak ada tugas tertunda';
  if (unsubmittedAssignments.length > 0) {
    const nextA = unsubmittedAssignments[unsubmittedAssignments.length - 1];
    if (nextA) {
      nextDeadlineAssignmentTitle = nextA.title;
      const diffMs = new Date(nextA.deadline).getTime() - Date.now();
      if (diffMs < 0) {
        nextDeadlineText = 'Terlewat';
      } else {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        nextDeadlineText = days > 0 ? `${days} Hari lagi` : `${hours} Jam lagi`;
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• PANEL KONTRIBUSI ANGGOTA •</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Halo, {fullUser?.name || user.name}
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            KELAS: {fullUser?.className || 'ANGGOTA EKSKUL'} • USERNAME: {user.username}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assignments"
            className="font-mono text-[10px] uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2"
          >
            <span>Daftar Tugas Aktif</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Points */}
        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>TOTAL POIN AKUMULASI</span>
            <Trophy className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {userPointsSummary.totalPoints}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">PTS</span>
          </div>
          <div className="text-xs text-brand font-mono font-medium">
            Peringkat #{userPointsSummary.rank} dari {userPointsSummary.totalMembers} Anggota
          </div>
        </div>

        {/* Submissions count */}
        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>STATUS PENUGASAN</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {ownSubmissions.length}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">
              / {activeAssignments.length} SELESAI
            </span>
          </div>
          <div className="text-xs text-text-3 font-mono">
            {activeAssignments.length - ownSubmissions.length <= 0
              ? 'Seluruh tugas telah dikumpulkan'
              : `${activeAssignments.length - ownSubmissions.length} tugas belum dikumpulkan`}
          </div>
        </div>

        {/* Next Deadline */}
        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>DEADLINE TERDEKAT</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold uppercase">
            {nextDeadlineText}
          </div>
          <div className="text-xs text-text-2 font-mono truncate max-w-full">
            {nextDeadlineAssignmentTitle}
          </div>
        </div>
      </div>

      {/* Active Assignments List */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
          <div>
            <h2 className="text-lg font-semibold text-text-1">
              Tugas & Proyek Berjalan
            </h2>
            <p className="text-xs font-mono text-text-3 mt-0.5 uppercase tracking-wider">
              KUMPULKAN TEPAT WAKTU UNTUK MENDAPATKAN POIN MAKSIMAL
            </p>
          </div>
          <Link
            href="/assignments"
            className="text-xs font-mono text-text-1 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Semua Tugas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeAssignments.length === 0 ? (
          <div className="py-12 text-center text-text-3 font-mono text-xs">
            Belum ada tugas aktif yang diterbitkan.
          </div>
        ) : (
          <div className="space-y-3.5">
            {activeAssignments.map((a) => {
              const isSubmitted = submittedAssignmentIds.has(a.id);
              const deadlineDate = new Date(a.deadline);
              const isOverdue = deadlineDate.getTime() < Date.now();

              return (
                <div
                  key={a.id}
                  className="p-4 border border-hairline rounded-none bg-surface hover:border-text-1 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none bg-brand-soft text-brand font-bold border border-brand/20">
                        {a.categoryName || 'TUGAS'}
                      </span>
                      <span className="text-xs font-mono text-text-3">
                        MAX SKOR: {a.maxScore} PTS
                      </span>
                      {isSubmitted ? (
                        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none font-medium">
                          ✓ SUDAH DIKUMPULKAN
                        </span>
                      ) : isOverdue ? (
                        <span className="font-mono text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-none font-medium">
                          ✕ DEADLINE BERAKHIR
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-none font-medium">
                          ● MENUNGGU SUBMISI
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-text-1">
                      {a.title}
                    </h3>
                    <p className="text-xs text-text-2 line-clamp-2 max-w-2xl leading-relaxed">
                      {a.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs font-mono">
                      <div className="text-text-3 text-[10px] uppercase">DEADLINE</div>
                      <div className="text-text-1 font-medium">
                        {deadlineDate.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <Link
                      href={`/assignments/${a.id}`}
                      className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none whitespace-nowrap"
                    >
                      {isSubmitted ? 'Lihat Submisi' : 'Kumpulkan'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Submissions History */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
          <div>
            <h2 className="text-lg font-semibold text-text-1">
              Riwayat Submisi Tugas Kamu
            </h2>
            <p className="text-xs font-mono text-text-3 mt-0.5 uppercase tracking-wider">
              DAFTAR BERKAS DAN TAUTAN YANG TELAH KAMU KIRIMKAN
            </p>
          </div>
          <Link
            href="/submissions"
            className="text-xs font-mono text-text-1 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Semua Riwayat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {ownSubmissions.length === 0 ? (
          <div className="py-8 text-center text-text-3 font-mono text-xs">
            Belum ada tugas yang kamu kumpulkan. Pilih tugas di atas untuk mulai submit.
          </div>
        ) : (
          <div className="divide-y divide-hairline border-y border-hairline">
            {ownSubmissions.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-text-1 text-[13px]">
                    {s.assignmentTitle || 'Tugas Ekskul'}
                  </p>
                  <p className="font-mono text-[10px] text-text-3 mt-0.5">
                    DIKUMPULKAN PADA{' '}
                    {new Date(s.submittedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 uppercase font-medium rounded-none ${
                      s.status === 'graded' || s.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status === 'graded'
                      ? `DINILAI: ${s.score ?? 0} PTS`
                      : s.status.toUpperCase()}
                  </span>

                  {s.linkUrl && (
                    <a
                      href={s.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-text-2 hover:text-text-1 flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Link</span>
                    </a>
                  )}

                  {s.fileUrl && (
                    <a
                      href={s.fileUrl}
                      download
                      className="font-mono text-[10px] text-text-2 hover:text-text-1 flex items-center gap-1 hover:underline"
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>Berkas</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
