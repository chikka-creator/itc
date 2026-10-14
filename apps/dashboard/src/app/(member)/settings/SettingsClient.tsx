'use client';

import React, { useState } from 'react';
import { KeyRound, User, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SettingsClientProps {
  user: {
    name: string;
    username: string;
    className: string;
    email: string;
    role: string;
    bio: string;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [lang, setLang] = useState<'id' | 'en'>('id');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password baru minimal harus 8 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah password');
      }

      setMessage({ type: 'success', text: 'Password akun kamu berhasil diperbarui!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah password';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Account Details & Language */}
      <div className="lg:col-span-5 space-y-6">
        {/* Account Details */}
        <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
            <User className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-1">Informasi Akun</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-text-3 block text-[10px] uppercase">NAMA LENGKAP</span>
              <span className="text-text-1 font-semibold">{user.name}</span>
            </div>

            <div>
              <span className="text-text-3 block text-[10px] uppercase">USERNAME</span>
              <span className="text-text-1 font-semibold">{user.username}</span>
            </div>

            <div>
              <span className="text-text-3 block text-[10px] uppercase">KELAS / JURUSAN</span>
              <span className="text-text-1 font-semibold">{user.className}</span>
            </div>

            <div>
              <span className="text-text-3 block text-[10px] uppercase">ROLE PENGGUNA</span>
              <span className="text-text-1 font-semibold uppercase">{user.role}</span>
            </div>

            {user.email && (
              <div>
                <span className="text-text-3 block text-[10px] uppercase">EMAIL TERDAFTAR</span>
                <span className="text-text-1 font-semibold">{user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Language Preference */}
        <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
            <Globe className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-1">Preferensi Bahasa</h2>
          </div>

          <p className="text-xs text-text-2">
            Pilih bahasa pengantar antarmuka portal.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLang('id')}
              className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider rounded-none border ${
                lang === 'id'
                  ? 'bg-[#111111] text-white border-[#111111] font-semibold'
                  : 'bg-surface text-text-2 border-hairline hover:bg-neutral-50'
              }`}
            >
              Bahasa Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider rounded-none border ${
                lang === 'en'
                  ? 'bg-[#111111] text-white border-[#111111] font-semibold'
                  : 'bg-surface text-text-2 border-hairline hover:bg-neutral-50'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Change Password */}
      <div className="lg:col-span-7">
        <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
            <KeyRound className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-text-1">Ubah Kata Sandi (Password)</h2>
          </div>

          <p className="text-xs text-text-2">
            Gunakan kombinasi minimal 8 karakter untuk menjaga keamanan akun portal kamu.
          </p>

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

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-text-2 mb-1.5">
                Password Saat Ini
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 focus:outline-none focus:border-text-1"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-text-2 mb-1.5">
                Password Baru (Min. 8 Karakter)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 focus:outline-none focus:border-text-1"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-text-2 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 focus:outline-none focus:border-text-1"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 font-mono text-[11px] uppercase tracking-wider bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Password...</span>
                  </>
                ) : (
                  <span>Perbarui Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
