'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    className: '',
    whatsapp: '',
    interest: 'Web Development',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      className: '',
      whatsapp: '',
      interest: 'Web Development',
      notes: '',
    });
    onClose();
  };

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-surface border border-hairline shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto rounded-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 size-8 rounded-none border border-hairline flex items-center justify-center text-text-3 hover:text-text-1 hover:border-text-1 font-mono text-sm transition-colors"
              aria-label="Tutup modal"
            >
              ✕
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative size-5 shrink-0 bg-brand/10 border border-brand/30 flex items-center justify-center rounded-none overflow-hidden p-0.5">
                      <Image
                        src="/Maskot-itc.png"
                        alt="IT Club Mascot"
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-3 font-semibold">
                      PENDAFTARAN ANGGOTA BARU • TA 2026/2027
                    </span>
                  </div>
                  <h3 className="text-[22px] sm:text-[24px] font-semibold text-text-1 tracking-[-0.02em]">
                    Gabung Komunitas IT Club
                  </h3>
                  <p className="text-body-sm text-text-2 mt-1">
                    Isi formulir singkat di bawah ini. Pengurus akan menghubungi via WhatsApp untuk konfirmasi dan undangan pertemuan perdana.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 mb-1.5 font-medium">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Raihan Pratama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-3.5 bg-bg border border-hairline rounded-none text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-text-1 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 mb-1.5 font-medium">
                        Kelas & Jurusan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: X PPLG 1 / X TKJ 2"
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        className="w-full h-11 px-3.5 bg-bg border border-hairline rounded-none text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-text-1 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 mb-1.5 font-medium">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="08xxxxxxxxxx"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full h-11 px-3.5 bg-bg border border-hairline rounded-none text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-text-1 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 mb-1.5 font-medium">
                      Peminatan / Divisi Utama
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full h-11 px-3.5 bg-bg border border-hairline rounded-none text-[13px] text-text-1 focus:outline-none focus:border-text-1 transition-colors cursor-pointer"
                    >
                      <option value="Web Development">Web Engineering (Next.js, TypeScript, Tailwind)</option>
                      <option value="Mobile App">Mobile Development (Flutter & Kotlin)</option>
                      <option value="UI/UX & Product Design">UI/UX & Product Design (Figma & Design Systems)</option>
                      <option value="Cyber Security & Networking">Cyber Security & Jaringan Komputer</option>
                      <option value="Competitive Programming">Competitive Programming & Persiapan LKS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 mb-1.5 font-medium">
                      Motivasi Singkat
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Apa yang ingin kamu pelajari atau capai di IT Club SMKN 1 Surabaya?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full p-3 bg-bg border border-hairline rounded-none text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none focus:border-text-1 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full h-12 bg-[#111111] text-white font-mono text-[11px] uppercase tracking-[0.12em] font-semibold hover:bg-[#2E2E2E] transition-all rounded-none border border-[#111111] shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Kirim Pendaftaran Sekarang</span>
                      <span>→</span>
                    </button>
                    <p className="font-mono text-[10px] text-text-3 text-center">
                      100% Gratis • Terbuka untuk seluruh siswa kelas X & XI SMKN 1 Surabaya
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* Success View */
              <div className="py-6 text-center">
                <div className="size-16 bg-emerald-100 border border-emerald-300 text-emerald-800 mx-auto flex items-center justify-center font-bold text-2xl rounded-none mb-4">
                  ✓
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-700 font-bold bg-emerald-50 px-3 py-1 border border-emerald-200">
                  PENDAFTARAN BERHASIL DITERIMA
                </span>
                <h3 className="text-[22px] font-semibold text-text-1 mt-4 mb-2">
                  Selamat Bergabung, {formData.name}!
                </h3>
                <p className="text-body-sm text-text-2 max-w-sm mx-auto mb-6">
                  Data pendaftaranmu untuk peminatan <strong>{formData.interest}</strong> telah dicatat oleh sistem IT Club. Pengurus kami akan segera mengontakmu melalui nomor WhatsApp <strong>{formData.whatsapp}</strong>.
                </p>

                <div className="p-4 bg-bg border border-hairline rounded-none text-left mb-6 text-[12px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-text-3 font-mono">STATUS:</span>
                    <span className="font-semibold text-emerald-700 font-mono">TERVERIFIKASI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3 font-mono">JADWAL PERDANA:</span>
                    <span className="font-semibold text-text-1 font-mono">Jumat, 14:30 WIB (Lab RPL 1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3 font-mono">AKSES PORTAL:</span>
                    <span className="text-text-1 font-mono">Akun dibuatkan saat sesi pertama</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleReset}
                    className="h-11 px-6 bg-[#111111] text-white font-mono text-[11px] uppercase tracking-[0.12em] font-medium hover:bg-[#2E2E2E] transition-colors rounded-none border border-[#111111]"
                  >
                    Selesai & Tutup
                  </button>
                  <a
                    href="https://chat.whatsapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-6 bg-surface border border-hairline text-text-1 font-mono text-[11px] uppercase tracking-[0.12em] font-medium hover:border-text-1 transition-colors rounded-none inline-flex items-center justify-center"
                  >
                    Gabung Grup WhatsApp ↗
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
