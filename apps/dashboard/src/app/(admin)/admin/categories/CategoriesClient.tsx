'use client';

import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  assignmentCount: number;
}

interface CategoriesClientProps {
  initialCategories: CategoryItem[];
}

const PRESET_COLORS = [
  '#7C8C6B', // Brand Sage
  '#3D6FE0', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#111111', // Solid Black
];

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#7C8C6B',
    sortOrder: 0,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      // fallback
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#7C8C6B',
      sortOrder: categories.length + 1,
    });
    setErrorMsg('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditTarget(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#7C8C6B',
      sortOrder: cat.sortOrder,
    });
    setErrorMsg('');
  };

  const handleNameChange = (val: string) => {
    const slugAuto = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === '' || prev.slug === slugAuto.slice(0, -1) ? slugAuto : prev.slug,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat kategori');
      }

      setSuccessMsg(`Kategori "${formData.name}" berhasil dibuat.`);
      setIsAddOpen(false);
      await refreshCategories();
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
      const res = await fetch(`/api/admin/categories/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui kategori');
      }

      setSuccessMsg(`Kategori "${formData.name}" berhasil diperbarui.`);
      setEditTarget(null);
      await refreshCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus kategori');
      }

      setSuccessMsg(`Kategori "${deleteTarget.name}" berhasil dihapus.`);
      setDeleteTarget(null);
      await refreshCategories();
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
            <span>DIVISI & KATEGORI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Kategori Penugasan Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL: {categories.length} KATEGORI AKTIF • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-surface border border-hairline p-6 rounded-none space-y-4 shadow-sm flex flex-col justify-between hover:border-text-1 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3.5 rounded-none border border-black/10 inline-block"
                    style={{ backgroundColor: cat.color || '#7C8C6B' }}
                  />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-text-3 font-semibold">
                    SLUG: {cat.slug}
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 border border-hairline rounded-none">
                  URUTAN #{cat.sortOrder}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-2 mt-1 leading-relaxed">
                  {cat.description || 'Tidak ada keterangan tambahan untuk kategori ini.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-text-3">
                <BookOpen className="w-3.5 h-3.5 text-brand" />
                <span>{cat.assignmentCount} tugas terkait</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  title="Edit kategori"
                  className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(cat);
                    setErrorMsg('');
                  }}
                  title={
                    cat.assignmentCount > 0
                      ? 'Tidak dapat menghapus: masih ada tugas aktif'
                      : 'Hapus kategori'
                  }
                  className={`p-1.5 border border-hairline rounded-none transition-colors ${
                    cat.assignmentCount > 0
                      ? 'opacity-40 cursor-not-allowed text-text-3'
                      : 'text-red-700 hover:text-red-900 hover:bg-red-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Category */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Tambah Kategori Baru
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  DIVISI PENUGASAN IT CLUB
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
                  NAMA KATEGORI *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Mobile Development"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  SLUG (URL KATEGORI) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. mobile-development"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  DESKRIPSI SINGKAT
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan materi/tugas divisi ini..."
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1.5">
                  WARNA LABEL
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: clr })}
                      style={{ backgroundColor: clr }}
                      className={`size-6 rounded-none transition-transform ${
                        formData.color === clr ? 'scale-125 ring-2 ring-black' : 'hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  URUTAN TAMPILAN
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
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
                  {loading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Edit Kategori {editTarget.name}
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PERBARUI DIVISI PENUGASAN
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
                  NAMA KATEGORI *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  SLUG (URL KATEGORI) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  DESKRIPSI SINGKAT
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1.5">
                  WARNA LABEL
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: clr })}
                      style={{ backgroundColor: clr }}
                      className={`size-6 rounded-none transition-transform ${
                        formData.color === clr ? 'scale-125 ring-2 ring-black' : 'hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  URUTAN TAMPILAN
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-24 px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
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

      {/* Modal: Delete Category */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-2 bg-red-50 border border-red-200 rounded-none">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-1 font-sans">
                  Hapus Kategori
                </h3>
                <p className="text-[10px] font-mono text-red-600 uppercase">
                  DIVISI: {deleteTarget.name}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <p className="text-xs text-text-2 leading-relaxed font-sans">
              Apakah Anda yakin ingin menghapus kategori{' '}
              <strong className="text-text-1">{deleteTarget.name}</strong>?
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
