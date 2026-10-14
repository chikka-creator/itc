'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileCheck, ExternalLink, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AssignmentSubmitFormProps {
  assignmentId: string;
  existingSubmission?: {
    id: string;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    linkUrl: string | null;
    status: string;
    score: number | null;
    feedback: string | null;
    submittedAt: Date;
  } | null;
  isOverdue: boolean;
}

export function AssignmentSubmitForm({
  assignmentId,
  existingSubmission,
  isOverdue,
}: AssignmentSubmitFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [linkUrl, setLinkUrl] = useState(existingSubmission?.linkUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(existingSubmission?.fileUrl || '');
  const [uploadedFileName, setUploadedFileName] = useState(existingSubmission?.fileName || '');
  const [uploadedFileSize, setUploadedFileSize] = useState(existingSubmission?.fileSize || 0);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(!existingSubmission);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file melebihi 100MB' });
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah file');
      }

      setUploadedFileUrl(data.fileUrl);
      setUploadedFileName(data.fileName);
      setUploadedFileSize(data.fileSize);
      setMessage({ type: 'success', text: `Berkas "${file.name}" berhasil diunggah.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengunggah berkas';
      setMessage({ type: 'error', text: msg });
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileUrl && !linkUrl) {
      setMessage({
        type: 'error',
        text: 'Wajib mengunggah berkas hasil kerja atau menyertakan tautan repository/desain.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          fileUrl: uploadedFileUrl || null,
          fileName: uploadedFileName || null,
          fileSize: uploadedFileSize || null,
          linkUrl: linkUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan penyerahan tugas');
      }

      setMessage({ type: 'success', text: 'Tugas kamu berhasil dikumpulkan!' });
      setIsEditing(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat submit';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-6">
      <div className="border-b border-hairline-soft pb-4">
        <h3 className="text-base font-semibold text-text-1">
          Pengumpulan Tugas
        </h3>
        <p className="text-xs font-mono text-text-3 mt-0.5 uppercase tracking-wider">
          UNGGAH BERKAS PROYEK ATAU TAUTKAN REPOSITORY GITHUB / FIGMA
        </p>
      </div>

      {message && (
        <div
          className={`p-3 text-xs font-mono rounded-none flex items-center gap-2 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* If already submitted and not in editing mode */}
      {existingSubmission && !isEditing ? (
        <div className="space-y-4">
          <div className="p-4 bg-bg border border-hairline rounded-none space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-3 uppercase">Status Submisi</span>
              <span
                className={`font-mono text-[10px] uppercase px-2.5 py-0.5 rounded-none font-bold ${
                  existingSubmission.status === 'graded' || existingSubmission.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : existingSubmission.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {existingSubmission.status.toUpperCase()}
              </span>
            </div>

            {existingSubmission.score !== null && (
              <div className="flex items-center justify-between pt-2 border-t border-hairline">
                <span className="font-mono text-xs text-text-3 uppercase">Nilai Diperoleh</span>
                <span className="font-mono text-lg font-bold text-text-1">
                  {existingSubmission.score} PTS
                </span>
              </div>
            )}

            {existingSubmission.feedback && (
              <div className="pt-2 border-t border-hairline space-y-1">
                <span className="font-mono text-[10px] text-text-3 uppercase block">Catatan Mentor</span>
                <p className="text-xs text-text-1 italic bg-surface p-2.5 border border-hairline">
                  &ldquo;{existingSubmission.feedback}&rdquo;
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-hairline space-y-2">
              <span className="font-mono text-[10px] text-text-3 uppercase block">Berkas / Link</span>
              {existingSubmission.fileName && (
                <div className="flex items-center justify-between text-xs font-mono p-2 bg-surface border border-hairline">
                  <span className="truncate pr-2">{existingSubmission.fileName}</span>
                  {existingSubmission.fileUrl && (
                    <a
                      href={existingSubmission.fileUrl}
                      download
                      className="text-brand hover:underline shrink-0"
                    >
                      Unduh
                    </a>
                  )}
                </div>
              )}

              {existingSubmission.linkUrl && (
                <div className="flex items-center justify-between text-xs font-mono p-2 bg-surface border border-hairline">
                  <span className="truncate pr-2">{existingSubmission.linkUrl}</span>
                  <a
                    href={existingSubmission.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline shrink-0 flex items-center gap-1"
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {!isOverdue && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 font-mono text-[11px] uppercase tracking-wider bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none"
            >
              Ubah / Perbarui Submisi
            </button>
          )}
        </div>
      ) : isOverdue && !existingSubmission ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-mono rounded-none">
          Batas waktu pengumpulan telah berakhir. Pengumpulan tugas baru tidak lagi diizinkan oleh sistem.
        </div>
      ) : (
        /* Submit / Edit Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-2 mb-2">
              1. Unggah Berkas Hasil Pengerjaan (ZIP / PDF / Image, Maks. 100MB)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".zip,.rar,.pdf,.png,.jpg,.jpeg,.tar,.gz"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-hairline hover:border-text-1 p-6 text-center cursor-pointer bg-bg transition-colors rounded-none"
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 text-brand animate-spin" />
                  <span className="font-mono text-xs text-text-2">Mengunggah berkas ke server...</span>
                </div>
              ) : uploadedFileName ? (
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-700">
                  <FileCheck className="w-5 h-5" />
                  <span className="font-semibold">{uploadedFileName}</span>
                  <span className="text-text-3">({(uploadedFileSize / 1024).toFixed(1)} KB)</span>
                  <span className="text-text-1 underline ml-2">Ganti berkas</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-text-3" />
                  <p className="text-xs font-mono text-text-1 font-medium">
                    Klik untuk memilih berkas atau seret berkas ke sini
                  </p>
                  <p className="text-[10px] font-mono text-text-3">
                    Format didukung: ZIP, PDF, PNG, JPG (Maks. 100MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-2 mb-2">
              2. Tautan Repository / Proyek (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/project atau link Figma..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 placeholder:text-text-3 focus:outline-none focus:border-text-1"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="flex-1 py-3 font-mono text-[11px] uppercase tracking-wider bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : existingSubmission ? (
                <span>Simpan Perubahan Submisi</span>
              ) : (
                <span>Kumpulkan Tugas Sekarang</span>
              )}
            </button>

            {existingSubmission && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider border border-hairline text-text-2 hover:text-text-1 rounded-none"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
