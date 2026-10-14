'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n';
import type { PublicStats, MeetingPreview, LeaderboardEntry } from '@/lib/data';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface FeaturesProps {
  dict: Dictionary;
  stats?: PublicStats;
  meetings?: MeetingPreview[];
  leaderboard?: LeaderboardEntry[];
}

export function Features({ dict, stats, meetings = [], leaderboard = [] }: FeaturesProps) {
  const nextMeeting = meetings[0];
  const topMember = leaderboard[0];

  return (
    <section id="features" className="bg-bg py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header Split: Left (Eyebrow + Title), Right (Lead + CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <MotionReveal variant="fade-up">
              <Eyebrow variant="dot">{dict.features.eyebrow}</Eyebrow>
            </MotionReveal>
            <MotionReveal variant="fade-up" delay={0.1}>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.02em] leading-[1.12] text-text-1">
                {dict.features.title}
              </h2>
            </MotionReveal>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <MotionReveal variant="fade-up" delay={0.2}>
              <p className="text-body-lg text-text-2 leading-relaxed mb-6">
                {dict.features.lead}
              </p>
              <div>
                <Button variant="solid" href="http://localhost:3001/dashboard">
                  {dict.features.cta}
                </Button>
              </div>
            </MotionReveal>
          </div>
        </div>

        {/* 2x2 Feature Cards Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 01: Collaborative Review / Penugasan */}
          <MotionReveal variant="fade-up" delay={0.1}>
            <FeatureCard
              no="01"
              title="Pengumpulan & Evaluasi Tugas"
              subtitle="Kirim karya digital dengan format fleksibel dan catatan versi"
              desc="Siswa dapat mengunggah file hasil praktikum (ZIP, PDF) atau menyematkan tautan live demo dan repository. Setiap submisi tercatat dengan penanda waktu presisi."
            >
              {/* Mock UI 1: Mini Task Table */}
              <div className="bg-surface/95 backdrop-blur-sm rounded-none border border-hairline shadow-float p-4 w-[92%] sm:w-[88%] mx-auto transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-hairline-soft">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-none bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] font-semibold text-text-1">Tugas Aktif & Submisi</span>
                  </div>
                  <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider bg-bg px-2 py-0.5 rounded-none border border-hairline">
                    <AnimatedCounter value={stats?.assignmentsCount || 4} /> AKTIF
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-xs transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-600 font-bold">✓</span>
                      <span className="font-medium text-text-1">Portfolio Web App</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-none bg-emerald-100 text-emerald-800 font-mono text-[9px] font-medium">
                      DINILAI 95
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-xs transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-500 font-bold">●</span>
                      <span className="font-medium text-text-1">API Auth & JWT</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-none bg-amber-100 text-amber-800 font-mono text-[9px] font-medium">
                      IN REVIEW
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-xs transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-3 font-bold">○</span>
                      <span className="font-medium text-text-1">Database Schema Migration</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-none bg-neutral-100 text-neutral-600 font-mono text-[9px] font-medium">
                      DRAFT
                    </span>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </MotionReveal>

          {/* Card 02: Performance Metrics */}
          <MotionReveal variant="fade-up" delay={0.2}>
            <FeatureCard
              no="02"
              title="Pelacakan Performa & Metrik Poin"
              subtitle="Statistik keaktifan individual yang transparan dan akuntabel"
              desc="Kalkulasi poin real-time yang memadukan nilai ketuntasan tugas, bonus ketepatan waktu, dan konsistensi kehadiran pada tiap sesi pembinaan ekskul."
            >
              {/* Mock UI 2: Stats Dashboard */}
              <div className="bg-surface/95 backdrop-blur-sm rounded-none border border-hairline shadow-float p-4 w-[92%] sm:w-[88%] mx-auto transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-hairline-soft">
                  <span className="text-[12px] font-semibold text-text-1">Statistik Capaian Ekosistem</span>
                  <span className="font-mono text-[10px] text-brand font-medium">SEMESTER GANJIL</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface transition-colors">
                    <p className="text-[18px] font-bold text-text-1 leading-tight">
                      <AnimatedCounter value={topMember?.points || 340} />
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-text-3 mt-1">TOP POIN</p>
                  </div>
                  <div className="p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface transition-colors">
                    <p className="text-[18px] font-bold text-emerald-600 leading-tight">
                      <AnimatedCounter value={98} suffix="%" />
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-text-3 mt-1">TEPAT WAKTU</p>
                  </div>
                  <div className="p-2 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface transition-colors">
                    <p className="text-[18px] font-bold text-text-1 leading-tight">
                      <AnimatedCounter value={stats?.membersCount || 36} />
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-text-3 mt-1">ANGGOTA AKTIF</p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-hairline-soft flex items-center justify-between font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-none">
                  <span>▲ +18% PERTUMBUHAN SKOR</span>
                  <span className="font-semibold">TOP 5% CLUB</span>
                </div>
              </div>
            </FeatureCard>
          </MotionReveal>

          {/* Card 03: Meeting & Attendance */}
          <MotionReveal variant="fade-up" delay={0.3}>
            <FeatureCard
              no="03"
              title="Presensi Pertemuan & Rekap Sesi"
              subtitle="Validasi kehadiran tanpa ribet form kertas yang tercecer"
              desc="Sistem absensi terintegrasi per sesi pertemuan ekskul dengan pencatatan status hadir, izin, atau sakit yang langsung tersinkron ke profil siswa."
            >
              {/* Mock UI 3: Attendance Schedule */}
              <div className="bg-surface/95 backdrop-blur-sm rounded-none border border-hairline shadow-float p-4 w-[92%] sm:w-[88%] mx-auto transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-hairline-soft">
                  <div>
                    <span className="text-[12px] font-semibold text-text-1">
                      Pertemuan #{nextMeeting?.meetingNo || 9}: {nextMeeting?.title || 'Lab Komputer'}
                    </span>
                    <p className="font-mono text-[10px] text-text-3">
                      {nextMeeting?.notes || 'Lab RPL 1'} • {nextMeeting?.date || 'Jumat, 14:30 WIB'}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-none bg-brand-soft text-brand font-mono text-[9px] uppercase font-bold flex items-center gap-1">
                    <span className="size-1.5 rounded-none bg-brand animate-ping inline-block" />
                    AKTIF
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-none bg-bg/60 hover:bg-surface transition-colors">
                    <span className="text-text-1 font-medium">{leaderboard[0]?.name || 'Ahmad Fauzan'} ({leaderboard[0]?.className || 'XII RPL 1'})</span>
                    <span className="text-emerald-700 font-mono text-[10px] font-bold">✓ 14:32 WIB</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-none bg-bg/60 hover:bg-surface transition-colors">
                    <span className="text-text-1 font-medium">{leaderboard[1]?.name || 'Siti Rahmawati'} ({leaderboard[1]?.className || 'XI RPL 2'})</span>
                    <span className="text-emerald-700 font-mono text-[10px] font-bold">✓ 14:33 WIB</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-none bg-bg/60 hover:bg-surface transition-colors">
                    <span className="text-text-1 font-medium">{leaderboard[2]?.name || 'Budi Santoso'} ({leaderboard[2]?.className || 'XII TKJ 1'})</span>
                    <span className="text-emerald-700 font-mono text-[10px] font-bold">✓ 14:35 WIB</span>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </MotionReveal>

          {/* Card 04: Progress Stepper Pipeline */}
          <MotionReveal variant="fade-up" delay={0.4}>
            <FeatureCard
              no="04"
              title="Alur Kerja Progres Mandiri"
              subtitle="Visualisasi tahap pengerjaan dari instruksi hingga rilis"
              desc="Setiap penugasan memiliki jalur penyelesaian yang terarah mulai dari pembagian brief spesifikasi, implementasi kode, review rekan, hingga status diterima."
            >
              {/* Mock UI 4: Stepper Pipeline */}
              <div className="bg-surface/95 backdrop-blur-sm rounded-none border border-hairline shadow-float p-4 w-[92%] sm:w-[88%] mx-auto transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-hairline-soft">
                  <span className="text-[12px] font-semibold text-text-1">Alur Penugasan Siswa</span>
                  <span className="font-mono text-[10px] text-text-3 font-semibold">4 TAHAPAN</span>
                </div>
                <div className="flex items-center justify-between py-2 px-1">
                  <div className="flex flex-col items-center text-center group/step">
                    <div className="size-8 rounded-none bg-brand text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-sm transition-transform group-hover/step:scale-110">
                      ✓
                    </div>
                    <span className="font-mono text-[9px] text-text-1 font-semibold mt-1.5 uppercase">01 BRIEF</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-brand mx-1" />
                  <div className="flex flex-col items-center text-center group/step">
                    <div className="size-8 rounded-none bg-brand text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-sm transition-transform group-hover/step:scale-110">
                      ✓
                    </div>
                    <span className="font-mono text-[9px] text-text-1 font-semibold mt-1.5 uppercase">02 CODE</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-brand mx-1" />
                  <div className="flex flex-col items-center text-center group/step">
                    <div className="size-8 rounded-none bg-brand text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-sm transition-transform group-hover/step:scale-110">
                      ●
                    </div>
                    <span className="font-mono text-[9px] text-text-1 font-semibold mt-1.5 uppercase">03 REVIEW</span>
                  </div>
                  <div className="h-0.5 flex-1 bg-hairline mx-1" />
                  <div className="flex flex-col items-center text-center group/step">
                    <div className="size-8 rounded-none border border-hairline bg-bg text-text-3 flex items-center justify-center font-mono text-[11px] transition-transform group-hover/step:scale-110">
                      ○
                    </div>
                    <span className="font-mono text-[9px] text-text-3 mt-1.5 uppercase">04 MERGED</span>
                  </div>
                </div>
              </div>
            </FeatureCard>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  subtitle,
  desc,
  children,
}: {
  no: string;
  title: string;
  subtitle: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative bg-surface rounded-none border border-hairline p-6 sm:p-8 transition-all duration-300 hover:shadow-float hover:-translate-y-1">
      {/* 4 Corner Crosshairs (+) */}
      <span className="absolute -top-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -top-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>
      <span className="absolute -bottom-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none pointer-events-none select-none">
        +
      </span>

      {/* Top Graphic Panel: Photo container with lush green backdrop + floating mock UI widget */}
      <div className="relative rounded-none aspect-[16/10] mb-6 flex items-center justify-center overflow-hidden border border-hairline/60 shadow-inner">
        <Image
          src="/campus.jpg"
          alt="Feature background foliage"
          fill
          className="object-cover brightness-[0.92] contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 560px"
        />
        {/* Soft botanical tint overlay */}
        <div className="absolute inset-0 bg-brand/20 backdrop-blur-[2px] pointer-events-none" />

        {/* Floating Mock UI Card */}
        <div className="relative z-10 w-full">{children}</div>
      </div>

      {/* Bottom Content: Title with Arrow, Subtitle, Divider, Description */}
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-[-0.015em] text-text-1 group-hover:text-brand transition-colors">
          {title}
        </h3>
        <span className="text-text-3 text-lg font-mono transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </div>
      <p className="text-[14px] text-text-2 mb-4">{subtitle}</p>
      <div className="border-t border-hairline-soft pt-4">
        <p className="text-[13px] sm:text-[14px] text-text-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}