'use client';

import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Download,
  Search,
  Check,
  AlertCircle,
  X,
  User,
  BookOpen,
} from 'lucide-react';

interface SubmissionItem {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentDeadline: Date;
  assignmentMaxScore: number;
  categoryName?: string | null;
  categoryColor?: string | null;
  userId: string;
  userName: string;
  userUsername: string;
  userClass?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  linkUrl?: string | null;
  status: string;
  score?: number | null;
  feedback?: string | null;
  submittedAt: Date;
  gradedAt?: Date | null;
}

interface GradingClientProps {
  initialSubmissions: SubmissionItem[];
}

export function GradingClient({ initialSubmissions }: GradingClientProps) {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(
    initialSubmissions.map((s) => ({
      ...s,
      assignmentDeadline: new Date(s.assignmentDeadline),
      submittedAt: new Date(s.submittedAt),
      gradedAt: s.gradedAt ? new Date(s.gradedAt) : null,
    }))
  );

  const [selectedId, setSelectedId] = useState<string>(
    submissions.find((s) => s.status === 'pending')?.id || submissions[0]?.id || ''
  );
  const [filter, setFilter] = useState<'pending' | 'graded' | 'accepted' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');

  const selectedSub = submissions.find((s) => s.id === selectedId);

  // Form states for selected submission
  const [inputScore, setInputScore] = useState<string>(
    selectedSub?.score !== null && selectedSub?.score !== undefined
      ? String(selectedSub.score)
      : '100'
  );
  const [inputFeedback, setInputFeedback] = useState<string>(selectedSub?.feedback || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Switch selected item updates local form fields
  const handleSelectSubmission = (sub: SubmissionItem) => {
    setSelectedId(sub.id);
    setInputScore(
      sub.score !== null && sub.score !== undefined
        ? String(sub.score)
        : String(sub.assignmentMaxScore || 100)
    );
    setInputFeedback(sub.feedback || '');
    setErrorMsg('');
  };

  const filteredList = submissions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch =
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.userUsername.toLowerCase().includes(search.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleGrade = async (targetStatus: 'graded' | 'accepted' | 'rejected') => {
    if (!selectedSub) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/grading/${selectedSub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          score: targetStatus === 'graded' ? Number(inputScore) : null,
          feedback: inputFeedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan penilaian');
      }

      setSuccessMsg(`Penilaian untuk ${selectedSub.userName} berhasil disimpan.`);

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSub.id
            ? {
                ...s,
                status: targetStatus,
                score: targetStatus === 'graded' ? Number(inputScore) : null,
                feedback: inputFeedback,
                gradedAt: new Date(),
              }
            : s
        )
      );

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• PANEL PENGURUS •</span>
            <span className="text-text-3/60">/</span>
            <span>PENILAIAN TUGAS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Review & Evaluasi Submisi
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            ANTREAN SUBMISI: {submissions.filter((s) => s.status === 'pending').length} BELUM DINILAI
            • TOTAL {submissions.length} BERKAS
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-none flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Pane Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Pane: Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-surface border border-hairline rounded-none flex flex-col shadow-sm">
          {/* Filters Bar */}
          <div className="p-4 border-b border-hairline space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
              <input
                type="text"
                placeholder="Cari siswa atau tugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['pending', 'graded', 'accepted', 'rejected', 'all'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-none transition-all ${
                    filter === tab
                      ? 'bg-[#111111] text-white font-semibold'
                      : 'bg-bg text-text-2 hover:text-text-1 border border-hairline'
                  }`}
                >
                  {tab === 'pending'
                    ? `Perlu Dinilai (${submissions.filter((s) => s.status === 'pending').length})`
                    : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items */}
          <div className="divide-y divide-hairline overflow-y-auto max-h-[600px] flex-1">
            {filteredList.length === 0 ? (
              <div className="p-8 text-center text-text-3 font-mono text-xs">
                Tidak ada submisi pada filter ini.
              </div>
            ) : (
              filteredList.map((item) => {
                const isSelected = item.id === selectedId;
                const isLate = item.submittedAt.getTime() > item.assignmentDeadline.getTime();

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSubmission(item)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'border-l-[#111111] bg-neutral-100/90'
                        : 'border-l-transparent hover:bg-neutral-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-sans text-xs font-semibold text-text-1 truncate">
                          {item.userName}
                        </div>
                        <div className="text-[10px] font-mono text-text-3">
                          @{item.userUsername} • {item.userClass || 'Anggota'}
                        </div>
                      </div>

                      <span
                        className={`inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold rounded-none shrink-0 ${
                          item.status === 'graded'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : item.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-text-2 mt-2 truncate font-medium">
                      {item.assignmentTitle}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-text-3 mt-2">
                      <span>
                        {item.submittedAt.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {isLate ? (
                        <span className="text-red-600 font-semibold uppercase">Terlambat</span>
                      ) : (
                        <span className="text-emerald-700 font-medium uppercase">Tepat Waktu</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Review & Grading Workspace (7 Cols) */}
        <div className="lg:col-span-7 bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm flex flex-col justify-between">
          {selectedSub ? (
            <>
              <div className="space-y-6">
                {/* Header student & assignment */}
                <div className="pb-5 border-b border-hairline">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-hairline text-[10px] font-mono uppercase bg-bg">
                      <span
                        className="size-2 rounded-none inline-block"
                        style={{ backgroundColor: selectedSub.categoryColor || '#7C8C6B' }}
                      />
                      <span>{selectedSub.categoryName || 'TUGAS'}</span>
                    </span>

                    <span className="font-mono text-xs text-text-3">
                      STATUS:{' '}
                      <strong className="text-text-1 uppercase">{selectedSub.status}</strong>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-text-1 font-sans">
                    {selectedSub.assignmentTitle}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-text-3" />
                      <span>
                        {selectedSub.userName} (@{selectedSub.userUsername})
                      </span>
                    </div>
                    <span>•</span>
                    <div>Kelas: {selectedSub.userClass || 'Umum'}</div>
                    <span>•</span>
                    <div>Max: {selectedSub.assignmentMaxScore} Poin</div>
                  </div>
                </div>

                {/* Submission Artifacts */}
                <div className="bg-bg border border-hairline p-4 rounded-none space-y-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-3 font-semibold">
                    BERKAS & TAUTAN YANG DIKUMPULKAN:
                  </div>

                  {selectedSub.fileUrl ? (
                    <div className="flex items-center justify-between p-3 bg-surface border border-hairline rounded-none">
                      <div className="flex items-center gap-2.5 min-w-0 pr-3">
                        <Download className="w-4 h-4 text-brand shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-mono text-text-1 truncate font-medium">
                            {selectedSub.fileName || 'Berkas Submisi Tugas'}
                          </div>
                          {selectedSub.fileSize && (
                            <div className="text-[10px] font-mono text-text-3">
                              {formatFileSize(selectedSub.fileSize)}
                            </div>
                          )}
                        </div>
                      </div>

                      <a
                        href={selectedSub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 bg-[#111111] text-white hover:bg-[#2E2E2E] rounded-none inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>Unduh File</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-text-3 italic">
                      Tidak ada file lampiran yang diunggah.
                    </div>
                  )}

                  {selectedSub.linkUrl && (
                    <div className="flex items-center justify-between p-3 bg-surface border border-hairline rounded-none">
                      <div className="flex items-center gap-2.5 min-w-0 pr-3">
                        <ExternalLink className="w-4 h-4 text-brand shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-mono text-text-1 truncate font-medium">
                            Tautan Eksternal (GitHub / Figma / Drive)
                          </div>
                          <div className="text-[10px] font-mono text-text-3 truncate">
                            {selectedSub.linkUrl}
                          </div>
                        </div>
                      </div>

                      <a
                        href={selectedSub.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-hairline text-text-1 hover:bg-neutral-100 rounded-none inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>Buka Tautan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Submission Timestamp Status */}
                  <div className="pt-2 border-t border-hairline-soft flex items-center justify-between text-xs font-mono text-text-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-text-3" />
                      <span>
                        Dikumpulkan:{' '}
                        {selectedSub.submittedAt.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </span>
                    </div>

                    {selectedSub.submittedAt.getTime() > selectedSub.assignmentDeadline.getTime() ? (
                      <span className="text-red-600 font-semibold uppercase">
                        Terlambat dari deadline
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium uppercase">
                        Tepat waktu sebelum deadline
                      </span>
                    )}
                  </div>
                </div>

                {/* Grading Form */}
                <div className="space-y-4 pt-2">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono uppercase text-text-3 font-semibold">
                        SKOR NILAI (0 - {selectedSub.assignmentMaxScore})
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-text-3">Preset:</span>
                        {[100, 95, 85, 75].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setInputScore(String(preset))}
                            className="px-2 py-0.5 border border-hairline bg-bg text-[10px] font-mono text-text-2 hover:text-text-1 hover:border-black rounded-none"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="number"
                      min={0}
                      max={selectedSub.assignmentMaxScore}
                      value={inputScore}
                      onChange={(e) => setInputScore(e.target.value)}
                      className="w-full sm:w-48 px-3 py-2 border border-hairline bg-bg text-text-1 font-mono text-lg font-bold rounded-none focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-text-3 font-semibold mb-1.5">
                      CATATAN FEEDBACK / MASUKAN UNTUK SISWA
                    </label>
                    <textarea
                      rows={3}
                      value={inputFeedback}
                      onChange={(e) => setInputFeedback(e.target.value)}
                      placeholder="Tulis ulasan kode, apresiasi, atau instruksi perbaikan untuk anggota..."
                      className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGrade('rejected')}
                    disabled={loading}
                    className="px-3.5 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Minta Revisi (Tolak)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGrade('accepted')}
                    disabled={loading}
                    className="px-3.5 py-2 border border-hairline text-text-2 hover:text-text-1 hover:bg-neutral-100 text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Terima Tanpa Nilai</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleGrade('graded')}
                  disabled={loading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan Nilai & Publikasikan'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-text-3 font-mono">
              <FileCheck className="w-12 h-12 mb-3 text-hairline" />
              <p className="text-sm">Pilih salah satu submisi di sebelah kiri untuk memulai penilaian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
