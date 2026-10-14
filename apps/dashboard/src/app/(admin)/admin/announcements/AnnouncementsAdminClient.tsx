'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Pin,
  CheckCircle2,
  X,
  Send,
  Eye,
  Calendar,
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  published: number;
  pinned: number;
  publishedAt?: Date | null;
  createdAt: Date;
}

interface AnnouncementsAdminClientProps {
  initialAnnouncements: AnnouncementItem[];
}

export function AnnouncementsAdminClient({
  initialAnnouncements,
}: AnnouncementsAdminClientProps) {
  const [announcementList, setAnnouncementList] = useState<AnnouncementItem[]>(
    initialAnnouncements.map((a) => ({
      ...a,
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
      createdAt: new Date(a.createdAt),
    }))
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AnnouncementItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    published: true,
    pinned: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncementList(
          data.announcements.map((a: any) => ({
            ...a,
            publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
            createdAt: new Date(a.createdAt),
          }))
        );
      }
    } catch {
      // fallback
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      body: '',
      published: true,
      pinned: false,
    });
    setErrorMsg('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item: AnnouncementItem) => {
    setEditTarget(item);
    setFormData({
      title: item.title,
      body: item.body,
      published: item.published === 1,
      pinned: item.pinned === 1,
    });
    setErrorMsg('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat pengumuman');
      }

      setSuccessMsg(`Pengumuman "${formData.title}" berhasil diposting.`);
      setIsAddOpen(false);
      await refreshAnnouncements();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/announcements/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui pengumuman');
      }

      setSuccessMsg(`Pengumuman "${formData.title}" berhasil diperbarui.`);
      setEditTarget(null);
      await refreshAnnouncements();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (item: AnnouncementItem) => {
    try {
      const nextPinned = item.pinned === 1 ? 0 : 1;
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: nextPinned }),
      });
      if (res.ok) {
        await refreshAnnouncements();
      }
    } catch {
      // fallback
    }
  };

  const handleTogglePublish = async (item: AnnouncementItem) => {
    try {
      const nextPublished = item.published === 1 ? 0 : 1;
      const res = await fetch(`/api/admin/announcements/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      });
      if (res.ok) {
        await refreshAnnouncements();
      }
    } catch {
      // fallback
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/announcements/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus pengumuman');
      }

      setSuccessMsg(`Pengumuman "${deleteTarget.title}" berhasil dihapus.`);
      setDeleteTarget(null);
      await refreshAnnouncements();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• PUSAT INFORMASI •</span>
            <span className="text-text-3/60">/</span>
            <span>PENGUMUMAN RESMI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Manajemen Pengumuman Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL {announcementList.length} PENGUMUMAN • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Success Notification */}
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcementList.length === 0 ? (
          <div className="bg-surface border border-hairline p-12 text-center text-text-3 font-mono text-xs rounded-none">
            Belum ada pengumuman yang dibuat. Klik tombol di atas untuk membuat pengumuman pertama.
          </div>
        ) : (
          announcementList.map((item) => (
            <div
              key={item.id}
              className={`bg-surface border p-6 rounded-none space-y-4 shadow-sm transition-all ${
                item.pinned === 1 ? 'border-brand bg-neutral-50/50' : 'border-hairline'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    {item.pinned === 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono uppercase tracking-wider rounded-none font-semibold">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>PINNED</span>
                      </span>
                    )}

                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-none ${
                        item.published === 1
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {item.published === 1 ? 'PUBLISHED' : 'DRAFT'}
                    </span>

                    <span className="text-[11px] font-mono text-text-3">
                      {item.createdAt.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-1 font-sans">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-2 leading-relaxed whitespace-pre-wrap font-sans">
                    {item.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleTogglePin(item)}
                    title={item.pinned === 1 ? 'Lepas Sematan (Unpin)' : 'Sematkan ke Atas (Pin)'}
                    className={`p-2 border border-hairline rounded-none transition-colors ${
                      item.pinned === 1
                        ? 'bg-neutral-900 text-white'
                        : 'text-text-2 hover:text-text-1 hover:bg-neutral-100'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={item.published === 1 ? 'Ubah jadi Draft' : 'Publikasikan Sekarang'}
                    className="p-2 border border-hairline text-text-2 hover:text-text-1 hover:bg-neutral-100 rounded-none transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit pengumuman"
                    className="p-2 border border-hairline text-text-2 hover:text-text-1 hover:bg-neutral-100 rounded-none transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteTarget(item);
                      setErrorMsg('');
                    }}
                    title="Hapus pengumuman"
                    className="p-2 border border-hairline text-red-700 hover:text-red-900 hover:bg-red-50 rounded-none transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Announcement */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Buat Pengumuman Baru
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PUBLIKASI KE LANDING PAGE & DASHBOARD MEMBER
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-text-3 hover:text-text-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  JUDUL PENGUMUMAN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pembagian Jadwal Workshop UI/UX & Web Dev"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  ISI PENGUMUMAN *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Tuliskan detail pengumuman untuk seluruh anggota..."
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-text-1">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="size-4 rounded-none accent-[#111111]"
                  />
                  <span>Langsung Publikasikan</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-text-1">
                  <input
                    type="checkbox"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="size-4 rounded-none accent-[#111111]"
                  />
                  <span>Sematkan ke Teratas (Pin)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-hairline text-text-2 hover:text-text-1 text-xs font-mono uppercase rounded-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan & Siarkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Announcement */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Edit Pengumuman
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PERBARUI KONTEN INFORMASI
                </p>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="text-text-3 hover:text-text-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  JUDUL PENGUMUMAN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  ISI PENGUMUMAN *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-text-1">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="size-4 rounded-none accent-[#111111]"
                  />
                  <span>Published (Terlihat Publik)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-text-1">
                  <input
                    type="checkbox"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="size-4 rounded-none accent-[#111111]"
                  />
                  <span>Sematkan ke Teratas</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 border border-hairline text-text-2 hover:text-text-1 text-xs font-mono uppercase rounded-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <h3 className="text-base font-semibold text-text-1 font-sans">
              Hapus Pengumuman
            </h3>
            <p className="text-xs text-text-2 leading-relaxed font-sans">
              Apakah Anda yakin ingin menghapus pengumuman{' '}
              <strong className="text-text-1 font-medium">"{deleteTarget.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-hairline text-text-2 hover:text-text-1 text-xs font-mono uppercase rounded-none transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2 bg-red-700 text-white hover:bg-red-800 text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
