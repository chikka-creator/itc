'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Trophy,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n';
import type { PublicStats } from '@/lib/data';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { JoinModal } from '@/components/ui/JoinModal';
import {
  LAB_PROJECTS,
  PORTFOLIO_PROJECTS,
  PRESTASI_MEMBERS,
  type ShowcaseProject,
  type MemberStory,
  type ShowcaseConfig,
} from '@/lib/showcaseData';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';
import { MemberDetailModal } from '@/components/ui/MemberDetailModal';

type PerkKey = 'lab' | 'prestasi' | 'portfolio';

interface JoinCTAProps {
  dict: Dictionary;
  stats?: PublicStats;
  showcase?: ShowcaseConfig;
}

export function JoinCTA({ stats, showcase }: JoinCTAProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activePerk, setActivePerk] = React.useState<PerkKey>('lab');
  const [selectedProject, setSelectedProject] = React.useState<ShowcaseProject | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<MemberStory | null>(null);

  const showcaseRef = React.useRef<HTMLDivElement>(null);

  const totalCapacity = 40;
  const currentMembers = stats?.membersCount || 36;
  const percentage = Math.min(Math.round((currentMembers / totalCapacity) * 100), 100);

  // Dynamic projects & members from admin database or fallback
  const labProjects = showcase?.labProjects && showcase.labProjects.length > 0
    ? showcase.labProjects
    : LAB_PROJECTS;
  const portfolioProjects = showcase?.portfolioProjects && showcase.portfolioProjects.length > 0
    ? showcase.portfolioProjects
    : PORTFOLIO_PROJECTS;
  const prestasiMembers = showcase?.prestasiMembers && showcase.prestasiMembers.length > 0
    ? showcase.prestasiMembers
    : PRESTASI_MEMBERS;

  const perks: {
    key: PerkKey;
    no: string;
    title: string;
    desc: string;
    tag: string;
    icon: typeof Terminal;
    actionLabel: string;
  }[] = [
    {
      key: 'lab',
      no: '01',
      title: 'Lab & Proyek Nyata',
      desc: 'Praktikum langsung dengan stack modern (Next.js, Flutter, AI, Cloud) di Lab Komputer SMKN 1 Surabaya yang ber-AC dan bertenaga tinggi.',
      tag: 'TECH STACK',
      icon: Terminal,
      actionLabel: 'Galeri Proyek Lab',
    },
    {
      key: 'prestasi',
      no: '02',
      title: 'Jalur Prestasi LKS & Lomba',
      desc: 'Bimbingan intensif dan pembinaan mental juara untuk ajang bergengsi seperti LKS Web Tech, IT Network System, hingga Hackathon Pelajar.',
      tag: 'COMPETITION',
      icon: Trophy,
      actionLabel: 'Ulasan & Medali LKS',
    },
    {
      key: 'portfolio',
      no: '03',
      title: 'Portofolio Siap Industri',
      desc: 'Lulus bukan sekadar bawa ijazah. Setiap anggota memiliki portofolio web hidup dan akun GitHub aktif yang memikat HRD perusahaan teknologi.',
      tag: 'CAREER',
      icon: Briefcase,
      actionLabel: 'Galeri Portofolio Web',
    },
  ];

  const handlePerkClick = (key: PerkKey) => {
    setActivePerk(key);
  };

  return (
    <section id="join" className="relative bg-bg-alt/80 py-24 md:py-36 border-t border-hairline/70 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionReveal variant="fade-up">
            <Eyebrow variant="dot" center>
              PENDAFTARAN ANGGOTA BARU IT CLUB
            </Eyebrow>
          </MotionReveal>

          <MotionReveal variant="fade-up" delay={0.1}>
            <h2 className="mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-text-1">
              Siap Mengembangkan Potensi Digitalmu Bersama Kami?
            </h2>
          </MotionReveal>

          <MotionReveal variant="fade-up" delay={0.2}>
            <p className="mt-4 text-body-lg text-text-2 leading-relaxed max-w-2xl mx-auto">
              Terbuka untuk seluruh siswa kelas X dan XI SMKN 1 Surabaya dari semua kompetensi keahlian. Tidak perlu mahir dulu, yang terpenting adalah kemauan belajar dan konsistensi.
            </p>
          </MotionReveal>

          {/* Quota Progress Banner */}
          <MotionReveal variant="scale" delay={0.25} className="mt-8">
            <div className="inline-block w-full max-w-md bg-surface p-4 border border-hairline rounded-none shadow-sm text-left">
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="flex items-center gap-1.5 text-text-1 font-semibold">
                  <span className="size-2 bg-emerald-500 animate-pulse rounded-none" />
                  KUOTA GELOMBANG 2026
                </span>
                <span className="text-text-3">
                  <AnimatedCounter value={currentMembers} /> / {totalCapacity} KURSI TERISI ({percentage}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full bg-bg border border-hairline overflow-hidden rounded-none">
                <div
                  className="h-full bg-brand transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-mono text-text-3 text-right">
                Tersisa {totalCapacity - currentMembers} slot lagi untuk periode ini
              </p>
            </div>
          </MotionReveal>
        </div>

        {/* 3 Perks Grid - Fully Clickable & Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {perks.map((p, idx) => {
            const isActive = activePerk === p.key;
            return (
              <MotionReveal key={p.no} variant="fade-up" delay={0.12 * (idx + 1)}>
                <button
                  type="button"
                  onClick={() => handlePerkClick(p.key)}
                  className={`group relative text-left w-full p-6 sm:p-8 rounded-none transition-all duration-300 flex flex-col justify-between h-full cursor-pointer select-none ${
                    isActive
                      ? 'bg-surface border-2 border-brand shadow-float -translate-y-1 ring-4 ring-brand/10'
                      : 'bg-surface/90 hover:bg-surface border border-hairline hover:border-text-1/40 hover:shadow-float hover:-translate-y-0.5'
                  }`}
                >
                  {/* 4 Corner Crosshairs (+) */}
                  <span className={`absolute -top-2.5 -left-2.5 font-mono text-sm leading-none pointer-events-none select-none ${isActive ? 'text-brand font-bold' : 'text-text-3'}`}>
                    +
                  </span>
                  <span className={`absolute -top-2.5 -right-2.5 font-mono text-sm leading-none pointer-events-none select-none ${isActive ? 'text-brand font-bold' : 'text-text-3'}`}>
                    +
                  </span>
                  <span className={`absolute -bottom-2.5 -left-2.5 font-mono text-sm leading-none pointer-events-none select-none ${isActive ? 'text-brand font-bold' : 'text-text-3'}`}>
                    +
                  </span>
                  <span className={`absolute -bottom-2.5 -right-2.5 font-mono text-sm leading-none pointer-events-none select-none ${isActive ? 'text-brand font-bold' : 'text-text-3'}`}>
                    +
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`size-10 border flex items-center justify-center rounded-none transition-colors ${
                        isActive
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-bg border-hairline text-text-1 group-hover:border-text-1/30'
                      }`}>
                        <p.icon className="size-5" strokeWidth={1.8} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="size-2 bg-brand animate-ping inline-block" />
                        )}
                        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 border rounded-none ${
                          isActive
                            ? 'bg-brand-soft text-brand font-bold border-brand/30'
                            : 'bg-bg text-text-3 border-hairline'
                        }`}>
                          {p.tag}
                        </span>
                      </div>
                    </div>

                    <h3 className={`text-[18px] sm:text-[20px] font-semibold transition-colors mb-2 ${
                      isActive ? 'text-brand' : 'text-text-1 group-hover:text-brand'
                    }`}>
                      {p.title}
                    </h3>

                    <p className="text-[13px] sm:text-[14px] text-text-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between font-mono text-[11px] transition-colors ${
                    isActive ? 'border-brand/30' : 'border-hairline-soft'
                  }`}>
                    <span className="text-text-3">KEUNTUNGAN #{p.no}</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      isActive ? 'text-brand' : 'text-text-2 group-hover:text-text-1'
                    }`}>
                      {isActive ? (
                        <>
                          <span className="inline-block size-1.5 bg-brand" />
                          <span>SEDANG DITAMPILKAN ↓</span>
                        </>
                      ) : (
                        <>
                          <span>KLIK LIHAT KARYA</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </span>
                  </div>
                </button>
              </MotionReveal>
            );
          })}
        </div>

        {/* Dynamic Showcase Panel Area */}
        <div ref={showcaseRef} className="mb-16">
          <AnimatePresence mode="wait">
            {/* View 1: Lab & Proyek Nyata Gallery */}
            {activePerk === 'lab' && (
              <motion.div
                key="lab-view"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="bg-surface border-2 border-hairline p-6 sm:p-10 shadow-float relative"
              >
                {/* Crosshairs */}
                <span className="absolute -top-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>

                {/* Showcase Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-hairline">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="size-4 text-brand" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">
                        GALERI PROYEK LAB & RISET DIGITAL
                      </span>
                    </div>
                    <h3 className="text-[22px] sm:text-[26px] font-bold text-text-1 tracking-[-0.02em]">
                      Karya Nyata yang Dikembangkan di Lab Komputer
                    </h3>
                    <p className="mt-1 text-[13px] sm:text-[14px] text-text-2 max-w-2xl">
                      Eksplorasi proyek-proyek praktikum mandiri dan tim siswa SMKN 1 Surabaya. Klik pada kartu proyek untuk melihat detail fitur dan pembuatnya.
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-text-3 bg-bg px-3 py-1 border border-hairline self-start sm:self-auto shrink-0">
                    TOTAL {labProjects.length} PROYEK TERPILIH
                  </span>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {labProjects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className="group bg-bg/50 hover:bg-surface border border-hairline hover:border-brand/60 p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-float hover:-translate-y-1"
                    >
                      <div>
                        {/* Top Meta Line */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3 bg-surface px-2 py-0.5 border border-hairline">
                            {proj.tag}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-brand bg-brand-soft px-2 py-0.5 border border-brand/20">
                            {proj.badge || 'PROYEK SISWA'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-[17px] sm:text-[18px] font-semibold text-text-1 group-hover:text-brand transition-colors mb-2 leading-snug">
                          {proj.title}
                        </h4>

                        {/* Desc */}
                        <p className="text-[13px] text-text-2 leading-relaxed line-clamp-2 mb-4">
                          {proj.description}
                        </p>

                        {/* Member Attribution with prominent @username */}
                        <div className="flex items-center gap-3 p-3 bg-surface border border-hairline mb-4">
                          <div
                            className={`size-9 ${proj.member.avatarBg || 'bg-[#1E3A4C]'} text-white flex items-center justify-center font-mono text-[11px] font-bold shrink-0 border border-white/20`}
                          >
                            {proj.member.avatarInitial}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[13px] font-semibold text-text-1 truncate">
                                {proj.member.name}
                              </p>
                              <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-1.5 py-0.2 border border-brand/20">
                                {proj.member.username}
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                              {proj.member.className} • {proj.member.role}
                            </p>
                          </div>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {proj.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] px-2 py-0.5 bg-bg border border-hairline text-text-2"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between font-mono text-[11px]">
                        <span className="text-text-3">TAHUN {proj.year}</span>
                        <span className="text-brand font-semibold group-hover:underline flex items-center gap-1">
                          <span>Lihat Detail Proyek</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 2: Jalur Prestasi LKS & Ulasan Member (Matching Photo 2) */}
            {activePerk === 'prestasi' && (
              <motion.div
                key="prestasi-view"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="bg-surface border-2 border-hairline p-6 sm:p-10 shadow-float relative"
              >
                {/* Crosshairs */}
                <span className="absolute -top-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>

                {/* Showcase Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-hairline">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="size-4 text-amber-500" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">
                        JALUR PRESTASI & PEMBUKTIAN ANGGOTA
                      </span>
                    </div>
                    <h3 className="text-[22px] sm:text-[26px] font-bold text-text-1 tracking-[-0.02em]">
                      Ulasan & Kisah Juara dari Siswa Berprestasi
                    </h3>
                    <p className="mt-1 text-[13px] sm:text-[14px] text-text-2 max-w-2xl">
                      Simak pengalaman nyata siswa dan alumni dalam meraih juara LKS dan menembus industri. <strong>Klik pada kartu ulasan mana pun</strong> untuk membuka biodata dan riwayat kejuaraan lengkap.
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-text-3 bg-bg px-3 py-1 border border-hairline self-start sm:self-auto shrink-0">
                    KLIK UNTUK LIHAT PROFIL
                  </span>
                </div>

                {/* Grid matching Photo 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prestasiMembers.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMember(item)}
                      className="group bg-surface rounded-none border border-hairline p-6 sm:p-7 shadow-sm hover:shadow-float flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/60 cursor-pointer"
                    >
                      <div>
                        {/* Avatar thumbnail + Name & Role & @username */}
                        <div className="flex items-center gap-3.5 mb-5">
                          <div
                            className={`size-12 rounded-none ${item.avatarBg || 'bg-[#3D4537]'} text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105`}
                          >
                            <span className="font-mono text-[12px] font-bold tracking-wider">
                              {item.avatarInitial}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[15px] font-semibold text-text-1 leading-snug group-hover:text-brand transition-colors">
                                {item.name}
                              </p>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-brand bg-brand-soft px-1.5 py-0.2 border border-brand/20 inline-block mt-0.5">
                              {item.username}
                            </span>
                            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-3 mt-1 truncate">
                              {item.role}
                            </p>
                          </div>
                        </div>

                        {/* Testimonial Quote */}
                        <p className="text-[13px] sm:text-[14px] text-text-2 leading-relaxed italic">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>

                      {/* Bottom Link: Read story -> + VERIFIED */}
                      <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between font-mono text-[10px] text-text-3">
                        <span className="text-text-1 font-medium group-hover:text-brand group-hover:underline flex items-center gap-1">
                          <span>Baca Profil & Kisah</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="text-brand font-semibold uppercase tracking-wider flex items-center gap-1">
                          <span className="size-1 bg-brand rounded-none inline-block" />
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 3: Portofolio Siap Industri Gallery */}
            {activePerk === 'portfolio' && (
              <motion.div
                key="portfolio-view"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="bg-surface border-2 border-hairline p-6 sm:p-10 shadow-float relative"
              >
                {/* Crosshairs */}
                <span className="absolute -top-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -top-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -left-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>
                <span className="absolute -bottom-2.5 -right-2.5 text-text-3 font-mono text-sm leading-none select-none">+</span>

                {/* Showcase Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-hairline">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="size-4 text-brand" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">
                        PORTOFOLIO DIGITAL & REPO GITHUB SIAP KERJA
                      </span>
                    </div>
                    <h3 className="text-[22px] sm:text-[26px] font-bold text-text-1 tracking-[-0.02em]">
                      Bukti Karya yang Langsung Memikat HRD Industri
                    </h3>
                    <p className="mt-1 text-[13px] sm:text-[14px] text-text-2 max-w-2xl">
                      Bukan sekadar tugas kelas. Anggota membangun aplikasi production-ready dan portofolio hidup berstandar industri. Klik kartu untuk melihat live demo dan detail.
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-text-3 bg-bg px-3 py-1 border border-hairline self-start sm:self-auto shrink-0">
                    TOTAL {portfolioProjects.length} PORTOFOLIO LIVE
                  </span>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioProjects.map((port) => (
                    <div
                      key={port.id}
                      onClick={() => setSelectedProject(port)}
                      className="group bg-bg/50 hover:bg-surface border border-hairline hover:border-brand/60 p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-float hover:-translate-y-1"
                    >
                      <div>
                        {/* Top Meta Line */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-3 bg-surface px-2 py-0.5 border border-hairline">
                            {port.tag}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                            {port.badge || 'PRODUCTION READY'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-[17px] sm:text-[18px] font-semibold text-text-1 group-hover:text-brand transition-colors mb-2 leading-snug">
                          {port.title}
                        </h4>

                        {/* Desc */}
                        <p className="text-[13px] text-text-2 leading-relaxed line-clamp-2 mb-4">
                          {port.description}
                        </p>

                        {/* Member Attribution with prominent @username */}
                        <div className="flex items-center gap-3 p-3 bg-surface border border-hairline mb-4">
                          <div
                            className={`size-9 ${port.member.avatarBg || 'bg-[#2E332A]'} text-white flex items-center justify-center font-mono text-[11px] font-bold shrink-0 border border-white/20`}
                          >
                            {port.member.avatarInitial}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[13px] font-semibold text-text-1 truncate">
                                {port.member.name}
                              </p>
                              <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-1.5 py-0.2 border border-brand/20">
                                {port.member.username}
                              </span>
                            </div>
                            <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                              {port.member.className} • {port.member.role}
                            </p>
                          </div>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {port.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] px-2 py-0.5 bg-bg border border-hairline text-text-2"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between font-mono text-[11px]">
                        <span className="text-text-3">STATUS: PRODUCTION READY</span>
                        <span className="text-brand font-semibold group-hover:underline flex items-center gap-1">
                          <span>Lihat Detail Portofolio</span>
                          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons Box */}
        <MotionReveal variant="scale" delay={0.4}>
          <div className="bg-surface border border-hairline p-8 sm:p-12 text-center rounded-none shadow-float max-w-3xl mx-auto relative overflow-hidden">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="relative size-6 shrink-0">
                <Image
                  src="/Maskot-itc.png"
                  alt="IT Club Mascot"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 font-semibold">
                REGISTRASI GRATIS & TERBUKA
              </span>
            </div>

            <h3 className="text-[24px] sm:text-[28px] font-semibold text-text-1 tracking-[-0.015em] mb-3">
              Mulai Perjalanan Coding & Rekayasa Teknologimu Hari Ini
            </h3>

            <p className="text-body text-text-2 max-w-lg mx-auto mb-8">
              Pendaftaran hanya memakan waktu 1 menit. Langsung dapatkan info jadwal pembekalan perdana dan bergabung bersama 36+ siswa berprestasi lainnya.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] px-8 h-12 inline-flex items-center justify-center gap-2 rounded-none bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all hover:-translate-y-0.5 border border-[#111111] shadow-md cursor-pointer"
              >
                <span>Daftar Anggota Sekarang</span>
                <span>→</span>
              </button>

              <a
                href="https://api.whatsapp.com/send?phone=6281234567890&text=Halo%20Pengurus%20IT%20Club%20SMKN%201%20Surabaya,%20saya%20ingin%20bertanya%20seputar%20pendaftaran%20ekskul"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] px-6 h-12 inline-flex items-center justify-center gap-2 rounded-none bg-surface border border-hairline text-text-1 hover:border-text-1 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <span>Tanya via WhatsApp</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            <div className="mt-8 pt-4 border-t border-hairline-soft flex flex-wrap items-center justify-center gap-6 font-mono text-[10px] text-text-3 uppercase tracking-wider">
              <span>✓ TANPA BIAYA PENDAFTARAN</span>
              <span>✓ SERTIFIKAT KEAKTIFAN EKSKUL</span>
              <span>✓ DIDAMPINGI INSTRUKTUR AHLI</span>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Interactive Modals */}
      <JoinModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
      <MemberDetailModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
