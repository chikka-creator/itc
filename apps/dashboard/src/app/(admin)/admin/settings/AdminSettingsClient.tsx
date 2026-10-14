'use client';

import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Send,
  Save,
  CheckCircle2,
  X,
  Bell,
  Globe,
  Award,
} from 'lucide-react';

interface SettingsMap {
  site_title?: string;
  contact_email?: string;
  contact_wa?: string;
  contact_ig?: string;
  point_weights?: {
    on_time: number;
    late: number;
    missing: number;
    attendance: number;
  };
}

interface AdminSettingsClientProps {
  initialSettings: SettingsMap;
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [siteSettings, setSiteSettings] = useState({
    site_title: initialSettings.site_title || 'IT Club SMKN 1 Surabaya',
    contact_email: initialSettings.contact_email || 'itclub@smkn1.sch.id',
    contact_wa: initialSettings.contact_wa || '0812-3456-7890',
    contact_ig: initialSettings.contact_ig || '@itclubsmkn1',
  });

  const [pointWeights, setPointWeights] = useState({
    on_time: initialSettings.point_weights?.on_time ?? 10,
    late: initialSettings.point_weights?.late ?? 5,
    missing: initialSettings.point_weights?.missing ?? 0,
    attendance: initialSettings.point_weights?.attendance ?? 5,
  });

  const [broadcastData, setBroadcastData] = useState({
    title: '',
    body: '',
    type: 'info' as 'info' | 'announcement' | 'assignment',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan pengaturan');
      }

      setSuccessMsg('Pengaturan identitas dan kontak portal berhasil disimpan.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ point_weights: pointWeights }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan bobot nilai');
      }

      setSuccessMsg('Konfigurasi bobot poin leaderboard berhasil disimpan.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.body) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim notifikasi');
      }

      setSuccessMsg(`Notifikasi "${broadcastData.title}" berhasil disiarkan ke seluruh anggota.`);
      setBroadcastData({ title: '', body: '', type: 'info' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
          <span>• KONFIGURASI SISTEM •</span>
          <span className="text-text-3/60">/</span>
          <span>PENGATURAN PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Pengaturan Sistem & Operasional
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          KONTROL PARAMETER GLOBAL, BOBOT POIN, DAN NOTIFIKASI
        </p>
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

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
          {errorMsg}
        </div>
      )}

      {/* Form 1: Identitas & Kontak Portal */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-hairline">
          <Globe className="w-4 h-4 text-brand" />
          <div>
            <h2 className="text-base font-semibold text-text-1 font-sans">
              Identitas Portal & Kontak Resmi
            </h2>
            <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
              INFORMASI YANG DITAMPILKAN DI LANDING PAGE & FOOTER
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSiteSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                JUDUL SITUS / PORTAL
              </label>
              <input
                type="text"
                value={siteSettings.site_title}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, site_title: e.target.value })
                }
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                EMAIL RESMI EKSKUL
              </label>
              <input
                type="email"
                value={siteSettings.contact_email}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, contact_email: e.target.value })
                }
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                NOMOR WHATSAPP CONTACT
              </label>
              <input
                type="text"
                value={siteSettings.contact_wa}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, contact_wa: e.target.value })
                }
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                AKUN INSTAGRAM RESMI
              </label>
              <input
                type="text"
                value={siteSettings.contact_ig}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, contact_ig: e.target.value })
                }
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Identitas Portal</span>
            </button>
          </div>
        </form>
      </div>

      {/* Form 2: Bobot Poin Leaderboard */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-hairline">
          <Award className="w-4 h-4 text-brand" />
          <div>
            <h2 className="text-base font-semibold text-text-1 font-sans">
              Bobot Poin & Sistem Ranking
            </h2>
            <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
              PARAMETER PERHITUNGAN POIN LEADERBOARD SECARA REAL-TIME
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveWeights} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                SUBMISI TEPAT WAKTU
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={pointWeights.on_time}
                  onChange={(e) =>
                    setPointWeights({ ...pointWeights, on_time: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono font-bold rounded-none focus:outline-none focus:border-[#111111]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-3">
                  PTS
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                SUBMISI TERLAMBAT
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={pointWeights.late}
                  onChange={(e) =>
                    setPointWeights({ ...pointWeights, late: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono font-bold rounded-none focus:outline-none focus:border-[#111111]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-3">
                  PTS
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                TIDAK MENGUMPULKAN
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={pointWeights.missing}
                  onChange={(e) =>
                    setPointWeights({ ...pointWeights, missing: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono font-bold rounded-none focus:outline-none focus:border-[#111111]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-3">
                  PTS
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                KEHADIRAN LAB
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={pointWeights.attendance}
                  onChange={(e) =>
                    setPointWeights({
                      ...pointWeights,
                      attendance: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono font-bold rounded-none focus:outline-none focus:border-[#111111]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-text-3">
                  PTS
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Bobot Poin</span>
            </button>
          </div>
        </form>
      </div>

      {/* Form 3: Broadcast Notifikasi Manual */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-hairline">
          <Bell className="w-4 h-4 text-brand" />
          <div>
            <h2 className="text-base font-semibold text-text-1 font-sans">
              Siarkan Notifikasi In-App Manual
            </h2>
            <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
              KIRIM PESAN LANGSUNG KE LONCENG NOTIFIKASI SELURUH ANGGOTA
            </p>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                JUDUL NOTIFIKASI *
              </label>
              <input
                type="text"
                required
                value={broadcastData.title}
                onChange={(e) =>
                  setBroadcastData({ ...broadcastData, title: e.target.value })
                }
                placeholder="e.g. Pengumuman Jam Mulai Pertemuan Ekskul Besok"
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                TIPE NOTIFIKASI
              </label>
              <select
                value={broadcastData.type}
                onChange={(e) =>
                  setBroadcastData({
                    ...broadcastData,
                    type: e.target.value as 'info' | 'announcement' | 'assignment',
                  })
                }
                className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
              >
                <option value="info">Informasi Umum</option>
                <option value="announcement">Pengumuman Penting</option>
                <option value="assignment">Pengingat Tugas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
              PESAN LENGKAP *
            </label>
            <textarea
              rows={3}
              required
              value={broadcastData.body}
              onChange={(e) =>
                setBroadcastData({ ...broadcastData, body: e.target.value })
              }
              placeholder="Tulis pesan yang akan diterima oleh seluruh anggota di portal..."
              className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm font-semibold"
            >
              <Send className="w-4 h-4" />
              <span>Siarkan Notifikasi ke Semua Anggota</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
