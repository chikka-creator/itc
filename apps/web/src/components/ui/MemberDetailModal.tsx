'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Quote, Github, Globe, Award, Sparkles, Check } from 'lucide-react';
import type { MemberStory } from '@/lib/showcaseData';

interface MemberDetailModalProps {
  member: MemberStory | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailModal({
  member,
  isOpen,
  onClose,
}: MemberDetailModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#001A22]/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-surface border border-hairline shadow-2xl z-10 overflow-hidden my-auto"
          >
            {/* 4 Corner Crosshairs */}
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

            {/* Top Bar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-bg/60">
              <div className="flex items-center gap-2.5">
                <span className="size-2 bg-emerald-500 animate-pulse inline-block" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-text-2 font-semibold">
                  PROFIL & JEJAK PRESTASI ANGGOTA
                </span>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-brand-soft text-brand font-bold border border-brand/20 flex items-center gap-1">
                  <Check className="size-2.5" />
                  VERIFIED
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup dialog"
                className="size-8 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-hairline/60 transition-colors border border-transparent hover:border-hairline"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Member Profile Hero */}
              <div className="flex items-start gap-4 sm:gap-5 pb-6 border-b border-hairline-soft">
                <div
                  className={`size-16 sm:size-18 ${member.avatarBg} text-white flex items-center justify-center font-mono text-[18px] sm:text-[20px] font-bold border border-white/20 shrink-0 shadow-md`}
                >
                  {member.avatarInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[20px] sm:text-[24px] font-bold text-text-1 tracking-[-0.02em] leading-tight">
                      {member.name}
                    </h3>
                    <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-2 py-0.5 border border-brand/20">
                      {member.username}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-text-3 uppercase tracking-wider mt-1">
                    {member.role}
                  </p>
                  <p className="text-[12px] text-text-2 font-mono mt-1">
                    Status: <span className="font-semibold text-text-1">{member.className}</span> • IT Club SMKN 1 Surabaya
                  </p>
                </div>
              </div>

              {/* Highlight Quote */}
              <div className="bg-bg/80 border border-hairline p-4 sm:p-5 relative">
                <Quote className="size-5 text-brand/40 mb-1" />
                <p className="text-[14px] text-text-1 leading-relaxed italic font-medium">
                  &ldquo;{member.quote}&rdquo;
                </p>
              </div>

              {/* Achievements & LKS Section */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 font-semibold flex items-center gap-1.5">
                  <Trophy className="size-3.5 text-amber-500" />
                  REKAP PRESTASI, LOMBA & PENGHARGAAN
                </span>
                <div className="space-y-2">
                  {member.achievements.map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-surface border border-hairline hover:border-text-1/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="size-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-[13px] font-semibold text-text-1">
                            {ach.title}
                          </p>
                          <p className="font-mono text-[10px] text-text-3">
                            Tahun Kompetisi {ach.year}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200">
                        {ach.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Story / Experience */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3 text-brand" />
                  PENGALAMAN & PROSES PEMBINAAN
                </span>
                <p className="text-[13px] text-text-2 leading-relaxed bg-surface p-3.5 border border-hairline/80">
                  {member.fullStory}
                </p>
              </div>

              {/* Technical Skills */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 font-semibold block mb-2">
                  KEAHLIAN & KOMPETENSI TEKNIS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-[11px] font-medium px-2.5 py-1 bg-bg border border-hairline text-text-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-6 py-4 border-t border-hairline bg-bg/60 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-text-3">
                TERVERIFIKASI OLEH PEMBINA EKSKUL SMKN 1
              </span>
              <div className="flex items-center gap-2.5">
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 inline-flex items-center gap-1.5 border border-hairline bg-surface text-text-1 hover:border-text-1 hover:bg-bg transition-colors"
                  >
                    <Github className="size-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {member.portfolioUrl && (
                  <a
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider px-4 py-2 inline-flex items-center gap-1.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors shadow-sm"
                  >
                    <Globe className="size-3.5" />
                    <span>Website Portofolio</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
