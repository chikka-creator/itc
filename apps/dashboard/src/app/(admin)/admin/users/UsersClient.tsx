'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  Trash2,
  Edit2,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  role: string;
  className?: string | null;
  phone?: string | null;
  bio?: string | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

interface UsersClientProps {
  initialUsers: UserRecord[];
  currentAdminId: string;
}

export function UsersClient({ initialUsers, currentAdminId }: UsersClientProps) {
  const [userList, setUserList] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'member'>('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
  const [resetTarget, setResetTarget] = useState<UserRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'member',
    className: '',
    phone: '',
    bio: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.className && u.className.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUserList(data.users || []);
      }
    } catch {
      // fallback
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'member',
      className: '',
      phone: '',
      bio: '',
    });
    setErrorMsg('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditTarget(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email || '',
      password: '',
      role: user.role,
      className: user.className || '',
      phone: user.phone || '',
      bio: user.bio || '',
    });
    setErrorMsg('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan anggota');
      }

      setSuccessMsg(`Anggota ${formData.name} berhasil ditambahkan.`);
      setIsAddOpen(false);
      await refreshUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${editTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          className: formData.className,
          phone: formData.phone,
          bio: formData.bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui pengguna');
      }

      setSuccessMsg(`Data ${formData.name} berhasil diperbarui.`);
      setEditTarget(null);
      await refreshUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${resetTarget.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mereset kata sandi');
      }

      setSuccessMsg(`Kata sandi akun @${resetTarget.username} berhasil direset.`);
      setResetTarget(null);
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus pengguna');
      }

      setSuccessMsg(`Akun @${deleteTarget.username} berhasil dihapus dari sistem.`);
      setDeleteTarget(null);
      await refreshUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• MANAJEMEN PENGGUNA •</span>
            <span className="text-text-3/60">/</span>
            <span>DATA ANGGOTA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Daftar Anggota & Pengurus Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL: {userList.length} AKUN TERDAFTAR • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Anggota Baru</span>
        </button>
      </div>

      {/* Toast Feedback */}
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
            placeholder="Cari nama, username, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[10px] font-mono uppercase text-text-3 shrink-0">FILTER PERAN:</span>
          <div className="inline-flex border border-hairline rounded-none bg-bg p-0.5">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                roleFilter === 'all'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Semua ({userList.length})
            </button>
            <button
              onClick={() => setRoleFilter('member')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                roleFilter === 'member'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Member ({userList.filter((u) => u.role === 'member').length})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase transition-all rounded-none ${
                roleFilter === 'admin'
                  ? 'bg-[#111111] text-white font-semibold'
                  : 'text-text-2 hover:text-text-1'
              }`}
            >
              Admin ({userList.filter((u) => u.role === 'admin').length})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                <th className="py-3.5 px-4 font-semibold">NAMA LENGKAP</th>
                <th className="py-3.5 px-4 font-semibold">USERNAME</th>
                <th className="py-3.5 px-4 font-semibold">PERAN</th>
                <th className="py-3.5 px-4 font-semibold">KELAS / DIVISI</th>
                <th className="py-3.5 px-4 font-semibold">KONTAK / EMAIL</th>
                <th className="py-3.5 px-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-3 font-mono">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-text-1">{u.name}</div>
                      {u.bio && (
                        <div className="text-[10px] text-text-3 truncate max-w-xs">{u.bio}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-text-2">@{u.username}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold rounded-none ${
                          u.role === 'admin'
                            ? 'bg-[#111111] text-white'
                            : 'bg-neutral-100 text-neutral-800 border border-hairline'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-2">
                      {u.className || <span className="text-text-3/60 italic">—</span>}
                    </td>
                    <td className="py-3.5 px-4 text-text-2">
                      <div>{u.email || <span className="text-text-3/60 italic">—</span>}</div>
                      {u.phone && <div className="text-[10px] text-text-3">{u.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit profil pengguna"
                          className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setResetTarget(u);
                            setNewPassword('');
                            setErrorMsg('');
                          }}
                          title="Reset kata sandi akun"
                          className="p-1.5 text-text-2 hover:text-text-1 hover:bg-neutral-100 border border-hairline rounded-none transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(u);
                            setErrorMsg('');
                          }}
                          disabled={u.id === currentAdminId}
                          title={
                            u.id === currentAdminId
                              ? 'Tidak bisa menghapus akun sendiri'
                              : 'Hapus pengguna'
                          }
                          className={`p-1.5 border border-hairline rounded-none transition-colors ${
                            u.id === currentAdminId
                              ? 'opacity-30 cursor-not-allowed text-text-3'
                              : 'text-red-700 hover:text-red-900 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add User */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Tambah Anggota Baru
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  REGISTRASI AKUN SISWA / PENGURUS IT CLUB
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

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    NAMA LENGKAP *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dimas Pratama"
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    USERNAME LOGIN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. dimas"
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    PASSWORD *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    PERAN SISTEM *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    <option value="member">Member (Anggota Ekskul)</option>
                    <option value="admin">Admin (Pengurus / Pembina)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    KELAS / DIVISI
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="e.g. XI RPL 1 / Web Dev"
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="siswa@smkn1.sch.id"
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  NO. WHATSAPP / HP
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
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
                  {loading ? 'Menyimpan...' : 'Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-lg w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Edit Profil @{editTarget.username}
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  PERBARUI INFORMASI ANGGOTA
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

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    PERAN SISTEM
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  >
                    <option value="member">Member (Anggota Ekskul)</option>
                    <option value="admin">Admin (Pengurus / Pembina)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    KELAS / DIVISI
                  </label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    NO. WHATSAPP
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  BIO SINGKAT
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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

      {/* Modal: Reset Password */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-brand" />
                <div>
                  <h3 className="text-base font-semibold text-text-1 font-sans">
                    Reset Password
                  </h3>
                  <p className="text-[10px] font-mono text-text-3 uppercase">
                    USER: @{resetTarget.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetTarget(null)}
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

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  PASSWORD BARU *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketik password baru (min 6 karakter)"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <p className="text-[11px] text-text-3 font-mono">
                Pengguna dapat langsung masuk menggunakan password baru ini.
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="px-4 py-2 border border-hairline text-text-2 hover:text-text-1 text-xs font-mono uppercase rounded-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Ubah Password'}
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
            <div className="flex items-center gap-3 text-red-700">
              <div className="p-2 bg-red-50 border border-red-200 rounded-none">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-1 font-sans">
                  Konfirmasi Hapus Akun
                </h3>
                <p className="text-[10px] font-mono text-red-600 uppercase">
                  TINDAKAN PERMANEN TIDAK BISA DIBATALKAN
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <p className="text-xs text-text-2 leading-relaxed font-sans">
              Apakah Anda yakin ingin menghapus akun{' '}
              <strong className="text-text-1">@{deleteTarget.username}</strong> ({deleteTarget.name})?
              Semua data submisi tugas dan riwayat absensi yang terhubung dengan akun ini akan ikut
              dihapus dari database.
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
                onClick={handleDeleteUser}
                disabled={loading}
                className="px-5 py-2 bg-red-700 text-white hover:bg-red-800 text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
