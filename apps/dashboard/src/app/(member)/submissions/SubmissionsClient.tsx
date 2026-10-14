'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, FileCheck, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SubmissionItem {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  categoryName: string;
  status: string;
  score: number | null;
  feedback: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  linkUrl: string | null;
  isLate: boolean;
  submittedAtStr: string;
}

export function SubmissionsClient({
  submissions,
}: {
  submissions: SubmissionItem[];
}) {
  const [tab, setTab] = useState<'all' | 'pending' | 'graded' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  const filtered = submissions.filter((s) => {
    if (search && !s.assignmentTitle.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 'pending') return s.status === 'pending';
    if (tab === 'graded') return s.status === 'graded' || s.status === 'accepted';
    if (tab === 'rejected') return s.status === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface border border-hairline p-1 rounded-none overflow-x-auto">
          {[
            { id: 'all', label: `Semua (${submissions.length})` },
            {
              id: 'pending',
              label: `Pending (${submissions.filter((s) => s.status === 'pending').length})`,
            },
            {
              id: 'graded',
              label: `Dinilai (${submissions.filter((s) => s.status === 'graded' || s.status === 'accepted').length})`,
            },
            {
              id: 'rejected',
              label: `Revisi / Ditolak (${submissions.filter((s) => s.status === 'rejected').length})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-none whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[#111111] text-white font-medium'
                  : 'text-text-2 hover:text-text-1 hover:bg-neutral-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-hairline text-xs font-mono rounded-none focus:outline-none focus:border-text-1 text-text-1 placeholder:text-text-3"
          />
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-hairline p-12 text-center rounded-none shadow-sm space-y-2">
          <p className="font-mono text-xs text-text-3 uppercase tracking-wider">
            Tidak ada riwayat submisi yang sesuai.
          </p>
          <button
            onClick={() => {
              setTab('all');
              setSearch('');
            }}
            className="text-xs font-mono text-brand hover:underline font-semibold"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-4 hover:border-text-1 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline-soft pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-brand-soft text-brand font-bold border border-brand/20 rounded-none">
                      {s.categoryName}
                    </span>
                    <span className="text-xs font-mono text-text-3">
                      DIKIRIM: {s.submittedAtStr} WIB
                    </span>
                    {s.isLate && (
                      <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-none">
                        TERLAMBAT
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-text-1">
                    {s.assignmentTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-none font-bold ${
                      s.status === 'graded' || s.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status === 'graded'
                      ? `SKOR: ${s.score ?? 0} PTS`
                      : s.status === 'accepted'
                      ? 'DITERIMA'
                      : s.status === 'rejected'
                      ? 'DITOLAK'
                      : 'PENDING REVIEW'}
                  </span>
                </div>
              </div>

              {/* Feedback Note if available */}
              {s.feedback && (
                <div className="p-3 bg-neutral-50 border border-hairline rounded-none">
                  <span className="font-mono text-[10px] uppercase text-text-3 block mb-1">
                    Catatan & Masukan Mentor:
                  </span>
                  <p className="text-xs text-text-1 italic leading-relaxed">
                    &ldquo;{s.feedback}&rdquo;
                  </p>
                </div>
              )}

              {/* Attachment Links & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-4 text-xs font-mono">
                  {s.fileName && (
                    <div className="flex items-center gap-1.5 text-text-2">
                      <FileCheck className="w-4 h-4 text-brand" />
                      <span>{s.fileName}</span>
                      {s.fileUrl && (
                        <a
                          href={s.fileUrl}
                          download
                          className="text-brand hover:underline font-bold ml-1"
                        >
                          [Unduh]
                        </a>
                      )}
                    </div>
                  )}

                  {s.linkUrl && (
                    <div className="flex items-center gap-1.5 text-text-2">
                      <ExternalLink className="w-4 h-4 text-brand" />
                      <a
                        href={s.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:underline truncate max-w-xs"
                      >
                        {s.linkUrl}
                      </a>
                    </div>
                  )}
                </div>

                <Link
                  href={`/assignments/${s.assignmentId}`}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-hairline hover:border-text-1 hover:bg-[#111111] hover:text-white transition-all rounded-none flex items-center gap-1"
                >
                  <span>Detail Tugas</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
