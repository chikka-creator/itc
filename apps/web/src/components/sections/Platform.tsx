'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/lib/i18n';
import type { PublicStats, LeaderboardEntry } from '@/lib/data';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface PlatformProps {
  dict: Dictionary;
  stats?: PublicStats;
  leaderboard?: LeaderboardEntry[];
}

export function Platform({ dict, stats, leaderboard = [] }: PlatformProps) {
  const [openIndex, setOpenIndex] = React.useState<number>(0);

  const platformItems = [
    {
      title: dict.platform.items[0]?.title || 'Dashboard Terpadu Anggota',
      desc: dict.platform.items[0]?.desc || 'Akses satu pintu untuk melihat tugas yang harus dikerjakan, deadline terdekat, riwayat presensi pertemuan, dan peringkat di leaderboard.',
      bullets: dict.platform.items[0]?.bullets || [
        'Ringkasan poin kontribusi & ranking terkini',
        'Notifikasi deadline & pengumuman pengurus',
        'Riwayat submisi beserta catatan revisi'
      ],
      tag: '01 / DASHBOARD',
      isLeaderboard: false,
    },
    {
      title: dict.platform.items[1]?.title || 'Pengumpulan Tugas & Link Repository',
      desc: dict.platform.items[1]?.desc || 'Kirim file tugas atau tautkan repository GitHub dan link Figma. Sistem otomatis merekam timestamp pengumpulan dan status tepat waktu.',
      bullets: dict.platform.items[1]?.bullets || [
        'Dukungan upload ZIP, PDF, atau direct link',
        'Validasi ukuran file dan format otomatis',
        'Status pengumpulan: Tepat Waktu atau Terlambat'
      ],
      tag: '02 / SUBMISSION',
      isLeaderboard: false,
    },
    {
      title: dict.platform.items[2]?.title || 'Presensi & Kehadiran Pertemuan',
      desc: dict.platform.items[2]?.desc || 'Pencatatan absensi mingguan transparan. Anggota dapat memverifikasi kehadiran langsung dari portal saat pertemuan ekskul berlangsung.',
      bullets: dict.platform.items[2]?.bullets || [
        'Pencatatan status Hadir, Izin, atau Sakit',
        'Rekap kehadiran per semester secara otomatis',
        'Pemberian poin tambahan untuk kehadiran konsisten'
      ],
      tag: '03 / ATTENDANCE',
      isLeaderboard: false,
    },
    {
      title: dict.platform.items[3]?.title || 'Evaluasi & Masukan Instruktur',
      desc: dict.platform.items[3]?.desc || 'Dapatkan skor objektif dan masukan mendalam dari pengurus atau pembina untuk setiap tugas yang telah dikumpulkan.',
      bullets: dict.platform.items[3]?.bullets || [
        'Skor transparan skala 0-100 poin',
        'Kolom feedback detail untuk perbaikan kode',
        'Notifikasi saat tugas selesai dinilai'
      ],
      tag: '04 / EVALUATION',
      isLeaderboard: false,
    },
    {
      title: 'Papan Peringkat & Apresiasi Prestasi',
      desc: 'Leaderboard publik yang memotivasi anggota untuk terus berkarya, menyelesaikan tantangan coding, dan aktif dalam setiap kegiatan ekskul.',
      bullets: [
        'Kalkulasi poin otomatis berdasarkan skor dan kehadiran',
        'Top 10 leaderboard dengan tampilan terhormat',
        'Badge pencapaian khusus untuk proyek terbaik'
      ],
      tag: '05 / LEADERBOARD',
      isLeaderboard: true,
    },
  ];

  return (
    <section id="platform" className="bg-bg-alt/70 py-24 md:py-36 border-y border-hairline/60 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Centered Header with Staggered Entrance */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <MotionReveal variant="fade-up">
            <Eyebrow variant="dot" center>
              {dict.platform.eyebrow}
            </Eyebrow>
          </MotionReveal>

          <MotionReveal variant="fade-up" delay={0.1}>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.02em] leading-[1.12] text-text-1">
              {dict.platform.title}
            </h2>
          </MotionReveal>

          <MotionReveal variant="fade-up" delay={0.2}>
            <p className="mt-4 text-body-lg text-text-2 leading-relaxed">
              {dict.platform.lead}
            </p>
          </MotionReveal>
        </div>

        {/* 2-Column Split: Visual Panel & Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Photo Panel with Floating Cards */}
          <div className="lg:col-span-5 relative">
            <MotionReveal variant="scale" delay={0.15}>
              <div className="relative aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] w-full rounded-none overflow-hidden shadow-photo bg-brand-soft border border-hairline/60">
                <Image
                  src="/hero-lab.jpg"
                  alt="IT Club Lab Collaboration"
                  fill
                  className="object-cover brightness-[0.95] contrast-[1.03] transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                {/* Mascot Square Badge on Left */}
                <div className="absolute top-8 left-6 size-16 rounded-none bg-surface/95 backdrop-blur-md border border-hairline shadow-float flex items-center justify-center p-2">
                  <Image
                    src="/Maskot-itc.png"
                    alt="IT Club Official Mascot"
                    width={52}
                    height={52}
                    className="object-contain"
                  />
                </div>

                {/* Stack of Floating Cards on Right with Staggered Hover */}
                <div className="absolute inset-x-6 bottom-8 space-y-3">
                  <div className="bg-surface/95 backdrop-blur-md rounded-none border border-hairline shadow-float p-3.5 flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                    <span className="size-6 rounded-none bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-text-1">
                        Pengumpulan Tugas Terpadu
                      </p>
                      <p className="text-[11px] font-mono text-text-3">
                        <AnimatedCounter value={stats?.submissionsCount || 142} /> Tugas & Link Repo Terkumpul
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface/95 backdrop-blur-md rounded-none border border-hairline shadow-float p-3.5 flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                    <span className="size-6 rounded-none bg-brand-soft text-brand flex items-center justify-center font-bold text-xs">
                      ●
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-text-1">
                        Presensi Pertemuan Lab
                      </p>
                      <p className="text-[11px] font-mono text-text-3">
                        <AnimatedCounter value={stats?.meetingsCount || 12} /> Sesi Lab Komputer Tercatat
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface/95 backdrop-blur-md rounded-none border border-hairline shadow-float p-3.5 flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                    <span className="size-6 rounded-none bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-text-1">
                        Papan Peringkat Terbuka
                      </p>
                      <p className="text-[11px] font-mono text-text-3">
                        Top Rank: {leaderboard[0]?.name || 'Ahmad Fauzan'} ({leaderboard[0]?.points || 340} PTS)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>

          {/* Right: Smooth Framer Motion Accordion */}
          <div className="lg:col-span-7">
            <MotionReveal variant="fade-up" delay={0.25}>
              <div className="divide-y divide-hairline border-y border-hairline">
                {platformItems.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="transition-colors duration-200">
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.015em] text-text-1 group-hover:text-brand transition-colors">
                          {item.title}
                        </span>
                        <span
                          className={`size-8 rounded-none border border-hairline flex items-center justify-center text-lg text-text-3 font-mono transition-all duration-300 group-hover:border-text-1 group-hover:text-text-1 ${
                            isOpen ? 'rotate-45 bg-text-1 text-white border-text-1' : ''
                          }`}
                        >
                          +
                        </span>
                      </button>

                      {/* Smooth Height & Opacity Transition */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                              transition: {
                                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.25, delay: 0.05 },
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: {
                                height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                                opacity: { duration: 0.15 },
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6">
                              <p className="text-body text-text-2 leading-relaxed mb-4">
                                {item.desc}
                              </p>

                              {/* If this is the Leaderboard Accordion, render live top leaderboard */}
                              {item.isLeaderboard && leaderboard.length > 0 ? (
                                <div className="my-4 space-y-2 border-t border-hairline pt-3">
                                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-3 mb-2 font-medium">
                                    TOP 5 ANGGOTA BERPRESTASI (REAL-TIME)
                                  </p>
                                  {leaderboard.slice(0, 5).map((l) => (
                                    <div
                                      key={l.rank}
                                      className="flex items-center justify-between p-2.5 bg-surface border border-hairline rounded-none hover:border-text-1/20 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="size-6 bg-text-1 text-white font-mono text-[10px] font-bold flex items-center justify-center rounded-none">
                                          0{l.rank}
                                        </span>
                                        <div>
                                          <p className="text-[13px] font-semibold text-text-1">{l.name}</p>
                                          <p className="font-mono text-[10px] text-text-3">{l.className || 'Anggota Aktif'}</p>
                                        </div>
                                      </div>
                                      <span className="font-mono text-[12px] font-bold text-text-1">
                                        {l.points} PTS
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="space-y-2 mb-4">
                                  {item.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2.5 text-[13px] text-text-2">
                                      <span className="text-brand text-xs font-bold">✓</span>
                                      <span>{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="pt-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 bg-surface px-2.5 py-1 rounded-none border border-hairline">
                                  {item.tag}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}