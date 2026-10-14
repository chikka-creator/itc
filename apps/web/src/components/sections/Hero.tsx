'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n';
import type { PublicStats, MeetingPreview, LeaderboardEntry } from '@/lib/data';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { ToolChip } from '@/components/ui/ToolChip';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { FloatingHub } from '@/components/ui/FloatingHub';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface HeroProps {
  dict: Dictionary;
  stats?: PublicStats;
  upcomingMeeting?: MeetingPreview;
  topLeader?: LeaderboardEntry;
}

export function Hero({ dict, stats, upcomingMeeting, topLeader }: HeroProps) {
  return (
    <section id="hero" className="relative bg-bg pt-20 md:pt-32 pb-16 md:pb-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-14">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <MotionReveal variant="fade-up" delay={0.05}>
              <Eyebrow variant="asterisk">{dict.hero.eyebrow}</Eyebrow>
            </MotionReveal>

            <MotionReveal variant="fade-up" delay={0.15}>
              <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.25rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-text-1">
                {dict.hero.title}
              </h1>
            </MotionReveal>

            <MotionReveal variant="fade-up" delay={0.25}>
              <p className="mt-6 text-body-lg text-text-2 max-w-[520px] leading-relaxed">
                {dict.hero.subtext}
              </p>
            </MotionReveal>

            <MotionReveal variant="fade-up" delay={0.35}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button variant="solid" href="http://localhost:3001/login">
                  {dict.hero.ctaPrimary}
                </Button>
                <Button variant="solid" href="#join">
                  {dict.hero.ctaSecondary}
                </Button>
              </div>
            </MotionReveal>

            <MotionReveal variant="fade-up" delay={0.45}>
              <div className="mt-14 pt-8 border-t border-hairline/80 flex flex-wrap items-center gap-2.5 text-text-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="mr-1">{dict.hero.toolsLabel}</span>
                {dict.hero.tools.map((t: string) => (
                  <ToolChip key={t}>{t}</ToolChip>
                ))}
              </div>
            </MotionReveal>
          </div>

          {/* Right Column: Photo panel with Floating 3D Task Hub */}
          <div className="lg:col-span-6 relative">
            <MotionReveal variant="scale" delay={0.2}>
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full rounded-none overflow-hidden shadow-photo bg-brand-soft border border-hairline/60">
                <Image
                  src="/campus.jpg"
                  alt="IT Club SMKN 1 Surabaya Campus & Community"
                  fill
                  priority
                  className="object-cover brightness-[0.96] contrast-[1.02] transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

                {/* Floating Task Hub Window Card with 3D Tilt & Ambient Float */}
                <div className="absolute inset-x-5 sm:inset-x-8 top-1/2 -translate-y-1/2">
                  <FloatingHub enableTilt={true}>
                    <div className="bg-surface/95 backdrop-blur-md rounded-none border border-hairline shadow-2xl p-5 sm:p-6 transition-all duration-300 hover:border-text-1/30">
                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline-soft">
                        <div className="flex items-center gap-2.5">
                          <div className="relative size-6 shrink-0 bg-brand/10 border border-brand/30 flex items-center justify-center rounded-none overflow-hidden p-0.5">
                            <Image
                              src="/Maskot-itc.png"
                              alt="IT Club Mascot"
                              width={22}
                              height={22}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-mono text-[12px] font-semibold text-text-1 tracking-[0.04em]">
                            itc.smkn1sby.sch.id
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-none bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-3 font-semibold">
                            LIVE PORTAL
                          </span>
                        </div>
                      </div>

                      {/* Task Items List */}
                      <div className="space-y-2.5">
                        {/* Task 01: Project / Assignment */}
                        <div className="group/item flex items-center justify-between p-2.5 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-sm hover:border-text-1/20 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-text-3 font-semibold group-hover/item:text-brand transition-colors">
                              01
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-text-1 group-hover/item:text-brand transition-colors">
                                Project Web App Portfolio
                              </p>
                              <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                                Next.js 14 • Deadline 15 Okt
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-none bg-emerald-100 text-emerald-800 text-[10px] font-mono font-medium uppercase tracking-wider">
                            ✓ Selesai
                          </span>
                        </div>

                        {/* Task 02: Next Meeting from DB */}
                        <div className="group/item flex items-center justify-between p-2.5 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-sm hover:border-text-1/20 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-text-3 font-semibold group-hover/item:text-brand transition-colors">
                              02
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-text-1 group-hover/item:text-brand transition-colors">
                                Pertemuan #{upcomingMeeting?.meetingNo || 9}: {upcomingMeeting?.title || 'Modern Web Engineering'}
                              </p>
                              <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                                {upcomingMeeting?.notes || 'Lab RPL 1'} • {upcomingMeeting?.date || 'Jumat, 14:30 WIB'}
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-none bg-brand-soft text-brand text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                            <span className="size-1.5 rounded-none bg-brand animate-ping inline-block" />
                            Terjadwal
                          </span>
                        </div>

                        {/* Task 03: Leaderboard Leader from DB */}
                        <div className="group/item flex items-center justify-between p-2.5 rounded-none bg-bg/80 border border-hairline/60 hover:bg-surface hover:shadow-sm hover:border-text-1/20 transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] text-text-3 font-semibold group-hover/item:text-brand transition-colors">
                              03
                            </span>
                            <div>
                              <p className="text-[13px] font-semibold text-text-1 group-hover/item:text-brand transition-colors">
                                Top Leaderboard: {topLeader?.name || 'Ahmad Fauzan'}
                              </p>
                              <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                                {topLeader?.className || 'XII RPL 1'} • Peringkat #01
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-none bg-neutral-900 text-white text-[10px] font-mono font-medium uppercase tracking-wider shadow-sm">
                            ★ {topLeader?.points || 340} PTS
                          </span>
                        </div>
                      </div>

                      {/* Card footer CTA */}
                      <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between text-[11px] font-mono text-text-3">
                        <span className="flex items-center gap-1.5">
                          <span className="size-1.5 bg-emerald-500 rounded-none inline-block" />
                          <AnimatedCounter value={stats?.membersCount || 36} /> ANGGOTA AKTIF
                        </span>
                        <a
                          href="http://localhost:3001/dashboard"
                          className="text-text-1 font-medium hover:underline cursor-pointer transition-colors"
                        >
                          Buka Dashboard →
                        </a>
                      </div>
                    </div>
                  </FloatingHub>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}