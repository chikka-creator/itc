'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  FileCheck,
  CheckCircle2,
  Archive,
  Search,
  Send,
  Eye,
} from 'lucide-react';

interface AssignmentItem {
  id: string;
  title: string;
  description?: string | null;
  categoryId: string;
  categoryName?: string | null;
  categoryColor?: string | null;
  deadline: Date;
  maxScore: number;
  status: 'draft' | 'published' | 'archived';
  submissionsCount: number;
  createdAt: Date;
}

interface CategoryOption {
  id: string;
  name: string;
  color?: string | null;
}

interface AssignmentsAdminClientProps {
  initialAssignments: AssignmentItem[];
  categories: CategoryOption[];
}

export function AssignmentsAdminClient({
  initialAssignments,
  categories,
}: AssignmentsAdminClientProps) {
  const [assignmentList, setAssignmentList] = useState<AssignmentItem[]>(initialAssignments);
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [search, setSearch] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AssignmentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssignmentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    deadline: '',
    maxScore: 100,
    status: 'published' as 'draft' | 'published' | 'archived',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshAssignments = async () => {
    try {
      const res = await fetch('/api/admin/assignments');
      if (res.ok) {
        const data = await res.json();
        setAssignmentList(
          data.assignments.map((a: any) => ({
            ...a,
            deadline: new Date(a.deadline),
            createdAt: new Date(a.createdAt),
          }))
        );
      }
    } catch {
      // fallback
    }
  };

  const filteredAssignments = assignmentList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterTab === 'all' || item.status === filterTab;
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    // Default deadline to 7 days from now at 23:59
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 0, 0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

    setFormData({
      title: '',
      description: '',
      categoryId: categories[0]?.id || '',
      deadline: localISOTime,
      maxScore: 100,
      status: 'published',
    });
    setErrorMsg('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item: AssignmentItem) => {
    setEditTarget(item);
    const d = new Date(item.deadline);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

    setFormData({
      title: item.title,
      description: item.description || '',
      categoryId: item.categoryId,
      deadline: localISOTime,
      maxScore: item.maxScore,
      status: item.status,
    });
    setErrorMsg('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat tugas');
      }

      setSuccessMsg(`Tugas "${formData.title}" berhasil dibuat dan disiarkan.`);
      setIsAddOpen(false);
      await refreshAssignments();
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
      const res = await fetch(`/api/admin/assignments/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui tugas');
      }

      setSuccessMsg(`Tugas "${formData.title}" berhasil diperbarui.`);
      setEditTarget(null);
      await refreshAssignments();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (item: AssignmentItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/assignments/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setSuccessMsg(
          nextStatus === 'published'
            ? `Tugas "${item.title}" berhasil dipublikasikan.`
            : `Tugas "${item.title}" disimpan sebagai draft.`
        );
        await refreshAssignments();
        setTimeout(() => setSuccessMsg(''), 4000);
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
      const res = await fetch(`/api/admin/assignments/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus tugas');
      }

      if (data.archived) {
        setSuccessMsg(data.message);
      } else {
        setSuccessMsg(`Tugas "${deleteTarget.title}" berhasil dihapus.`);
      }

      setDeleteTarget(null);
      await refreshAssignments();
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
            <span>• MANAJEMEN KURIKULUM •</span>
            <span className="text-text-3/60">/</span>
            <span>PENUGASAN ANGGOTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Daftar Tugas & Materi Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL: {assignmentList.length} PENUGASAN TERCATAT • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
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

      {/* Filters Bar */}
      <div className="bg-surface border border-hairline p-4 rounded-none flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Cari judul penugasan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[10px] font-mono uppercase text-text-3 shrink-0">STATUS:</span>
          <div className="inline-flex border border-hairline rounded-none bg-bg p-0.5">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                filterTab === 'all'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Semua ({assignmentList.length})
            </button>
            <button
              onClick={() => setFilterTab('published')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                filterTab === 'published'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Aktif ({assignmentList.filter((a) => a.status === 'published').length})
            </button>
            <button
              onClick={() => setFilterTab('draft')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                filterTab === 'draft'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Draft ({assignmentList.filter((a) => a.status === 'draft').length})
            </button>
            <button
              onClick={() => setFilterTab('archived')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                filterTab === 'archived'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Arsip ({assignmentList.filter((a) => a.status === 'archived').length})
            </button>
          </div>
        </div>
      </div>

      {/* Assignment List Table */}
      <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                <th className="py-3.5 px-4 font-semibold">JUDUL TUGAS</th>
                <th className="py-3.5 px-4 font-semibold">KATEGORI</th>
                <th className="py-3.5 px-4 font-semibold">TENGGAT WAKTU</th>
                <th className="py-3.5 px-4 font-semibold">MAX NILAI</th>
                <th className="py-3.5 px-4 font-semibold">SUBMISI</th>
                <th className="py-3.5 px-4 font-semibold">STATUS</th>
                <th className="py-3.5 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-3 font-mono">
                    Tidak ada penugasan yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const deadlinePassed = new Date(a.deadline).getTime() < Date.now();

                  return (
                    <tr key={a.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-sans font-medium text-text-1">{a.title}</div>
                        {a.description && (
                          <div className="text-[10px] text-text-3 truncate max-w-xs">
                            {a.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-hairline rounded-none text-[10px] font-mono uppercase bg-bg">
                          <span
                            className="size-2 rounded-none inline-block"
                            style={{ backgroundColor: a.categoryColor || '#7C8C6B' }}
                          />
                          <span>{a.categoryName || 'Umum'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-2">
                        <div>
                          {new Date(a.deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        {deadlinePassed && (
                          <div className="text-[10px] text-red-600 font-semibold">
                            Telah Berakhir
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-text-1 font-semibold">{a.maxScore} Poin</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-text-2">
                          <FileCheck className="w-3.5 h-3.5 text-brand" />
                          <span>{a.submissionsCount} berkas</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-none ${
                            a.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : a.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-neutral-100 text-neutral-700 border border-hairline'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleTogglePublish(a)}
                            title={
                              a.status === 'published' ? 'Ubah jadi Draft' : 'Publikasikan Tugas'
                            }
                            className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(a)}
                            title="Edit tugas"
                            className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(a);
                              setErrorMsg('');
                            }}
                            title="Hapus / Arsipkan tugas"
                            className="p-1.5 text-red-700 hover:text-red-900 hover:bg-red-50 border border-hairline rounded-none transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Assignment */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Buat Penugasan Baru
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  KURIKULUM IT CLUB SMKN 1 SURABAYA
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
                  JUDUL PENUGASAN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Desain Landing Page di Figma"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    KATEGORI DIVISI *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    MAKSIMAL NILAI
                  </label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    TENGGAT WAKTU (DEADLINE) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    STATUS PUBLIKASI
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published' | 'archived',
                      })
                    }
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    <option value="published">Langsung Publikasikan (Kirim Notifikasi)</option>
                    <option value="draft">Simpan Sebagai Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  DESKRIPSI & INSTRUKSI TUGAS (MARKDOWN)
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan kebutuhan tugas, link referensi, spesifikasi file yang harus dikumpulkan..."
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
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
                  {loading ? 'Menyimpan...' : 'Simpan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Assignment */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Edit Penugasan
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  ID: {editTarget.id.slice(0, 12)}...
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
                  JUDUL PENUGASAN *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    KATEGORI DIVISI *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    MAKSIMAL NILAI
                  </label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    TENGGAT WAKTU (DEADLINE) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    STATUS PUBLIKASI
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'draft' | 'published' | 'archived',
                      })
                    }
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    <option value="published">Published (Aktif untuk siswa)</option>
                    <option value="draft">Draft (Belum terlihat oleh siswa)</option>
                    <option value="archived">Archived (Diarsipkan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  DESKRIPSI & INSTRUKSI TUGAS (MARKDOWN)
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
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

      {/* Modal: Delete / Archive Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-2 bg-red-50 border border-red-200 rounded-none">
                <Archive className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-1 font-sans">
                  Hapus / Arsip Penugasan
                </h3>
                <p className="text-[10px] font-mono text-red-600 uppercase">
                  TUGAS: {deleteTarget.title}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <p className="text-xs text-text-2 leading-relaxed font-sans">
              {deleteTarget.submissionsCount > 0 ? (
                <>
                  Tugas ini telah memiliki{' '}
                  <strong className="text-text-1 font-mono">
                    {deleteTarget.submissionsCount} berkas submisi siswa
                  </strong>
                  . Sesuai kebijakan data ekskul, tugas ini akan{' '}
                  <strong className="text-text-1">dialihkan statusnya menjadi Arsip</strong> untuk
                  menjaga integritas riwayat penilaian.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus tugas ini? Belum ada submisi yang masuk,
                  sehingga data tugas akan dihapus secara permanen.
                </>
              )}
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
                {loading
                  ? 'Memproses...'
                  : deleteTarget.submissionsCount > 0
                  ? 'Arsipkan Tugas'
                  : 'Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
