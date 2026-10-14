'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Code, CheckCircle2, User, Sparkles } from 'lucide-react';
import type { ShowcaseProject } from '@/lib/showcaseData';

interface ProjectDetailModalProps {
  project: ShowcaseProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
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

  if (!project) return null;

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
                <span className="size-2 bg-brand animate-pulse inline-block" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-text-2 font-semibold">
                  {project.category === 'lab' ? 'PROYEK LAB PRAKTIKUM' : 'PORTOFOLIO SIAP INDUSTRI'} • #{project.year}
                </span>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-brand-soft text-brand font-bold border border-brand/20">
                  {project.badge}
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
              {/* Project Title & Author Badge */}
              <div>
                <h3 className="text-[22px] sm:text-[26px] font-bold text-text-1 tracking-[-0.02em] leading-tight">
                  {project.title}
                </h3>
                <p className="mt-2 text-[14px] text-text-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Author / Member Card Bar */}
              <div className="bg-bg/80 border border-hairline p-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`size-11 ${project.member.avatarBg} text-white flex items-center justify-center font-mono text-[13px] font-bold border border-white/20 shrink-0 shadow-sm`}
                  >
                    {project.member.avatarInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-text-1">
                        {project.member.name}
                      </p>
                      <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-1.5 py-0.2 border border-brand/20">
                        {project.member.username}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider mt-0.5">
                      {project.member.className} • {project.member.role}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-text-3 uppercase tracking-wider flex items-center gap-1.5 bg-surface px-2.5 py-1 border border-hairline">
                  <User className="size-3 text-brand" />
                  <span>KARYA RESMI ANGGOTA</span>
                </div>
              </div>

              {/* Highlights Section */}
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3 text-brand" />
                  KAPABILITAS & FITUR UNGGULAN
                </span>
                <div className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-[13px] text-text-2 bg-surface p-2.5 border border-hairline/80"
                    >
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3 font-semibold flex items-center gap-1.5 mb-2.5">
                  <Code className="size-3 text-brand" />
                  TECH STACK & TOOLS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] font-medium px-2.5 py-1 bg-bg border border-hairline text-text-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="px-6 py-4 border-t border-hairline bg-bg/60 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-text-3">
                ID KARYA: #{project.id.toUpperCase()}
              </span>
              <div className="flex items-center gap-2.5">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 inline-flex items-center gap-1.5 border border-hairline bg-surface text-text-1 hover:border-text-1 hover:bg-bg transition-colors"
                  >
                    <Github className="size-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider px-4 py-2 inline-flex items-center gap-1.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors shadow-sm"
                  >
                    <span>Buka Demo</span>
                    <ExternalLink className="size-3.5" />
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
