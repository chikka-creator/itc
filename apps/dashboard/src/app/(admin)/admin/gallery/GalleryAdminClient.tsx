'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string | null;
  sortOrder: number;
}

interface GalleryAdminClientProps {
  initialGallery: GalleryItem[];
}

export function GalleryAdminClient({ initialGallery }: GalleryAdminClientProps) {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(initialGallery);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    sortOrder: 0,
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setGalleryList(data.gallery || []);
      }
    } catch {
      // fallback
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan foto');
      }

      setSuccessMsg('Foto kegiatan berhasil ditambahkan ke galeri.');
      setIsAddOpen(false);
      await refreshGallery();
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
      const res = await fetch(`/api/admin/gallery/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui foto');
      }

      setSuccessMsg('Foto galeri berhasil diperbarui.');
      setEditTarget(null);
      await refreshGallery();
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
      const res = await fetch(`/api/admin/gallery/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus foto');
      }

      setSuccessMsg('Foto berhasil dihapus dari galeri.');
      setDeleteTarget(null);
      await refreshGallery();
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
            <span>• DOKUMENTASI & MEDIA •</span>
            <span className="text-text-3/60">/</span>
            <span>GALERI FOTO EKSKUL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Galeri Kegiatan IT Club
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL {galleryList.length} DOKUMENTASI TERUNGGAH • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              imageUrl: '',
              caption: '',
              sortOrder: galleryList.length + 1,
            });
            setErrorMsg('');
            setIsAddOpen(true);
          }}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Foto Baru</span>
        </button>
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

      {/* Gallery Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryList.length === 0 ? (
          <div className="col-span-full bg-surface border border-hairline p-12 text-center text-text-3 font-mono text-xs rounded-none">
            Belum ada dokumentasi foto yang diunggah. Klik "Upload Foto Baru" untuk menambahkan foto kegiatan ekskul.
          </div>
        ) : (
          galleryList.map((item) => (
            <div
              key={item.id}
              className="bg-surface border border-hairline rounded-none overflow-hidden shadow-sm flex flex-col justify-between group hover:border-text-1 transition-all"
            >
              <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.caption || 'Foto Galeri'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-none">
                  #{item.sortOrder}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-text-2 font-sans line-clamp-2">
                  {item.caption || <span className="italic text-text-3">Tanpa keterangan</span>}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-hairline">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-text-3 hover:text-text-1 flex items-center gap-1"
                  >
                    <span>Lihat Asli</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditTarget(item);
                        setFormData({
                          imageUrl: item.imageUrl,
                          caption: item.caption || '',
                          sortOrder: item.sortOrder,
                        });
                        setErrorMsg('');
                      }}
                      className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(item);
                        setErrorMsg('');
                      }}
                      className="p-1.5 text-red-700 hover:text-red-900 hover:bg-red-50 border border-hairline rounded-none transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Upload / Create Photo */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Unggah Dokumentasi Foto
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PUBLIKASI KE LANDING PAGE
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
                  PILIH FILE DARI KOMPUTER
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-none file:border file:border-hairline file:text-xs file:font-mono file:bg-neutral-100 hover:file:bg-neutral-200"
                  />
                  {uploading && (
                    <span className="text-[10px] font-mono text-text-3">Mengunggah...</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  ATAU MASUKKAN URL GAMBAR *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://... atau /images/..."
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  CAPTION / KETERANGAN FOTO
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Sesi Hands-on Coding di Lab Multimedia 1"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  NOMOR URUTAN TAMPILAN
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
                  disabled={loading || uploading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Photo */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Edit Foto Galeri
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PERBARUI KETERANGAN & URUTAN
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
                  URL GAMBAR *
                </label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  CAPTION / KETERANGAN FOTO
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  NOMOR URUTAN TAMPILAN
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

      {/* Modal: Delete Photo */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <h3 className="text-base font-semibold text-text-1 font-sans">
              Hapus Foto dari Galeri
            </h3>
            <p className="text-xs text-text-2 leading-relaxed font-sans">
              Apakah Anda yakin ingin menghapus foto ini dari galeri publik?
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
