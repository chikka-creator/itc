'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { PRESTASI_MEMBERS, type MemberStory, type ShowcaseConfig } from '@/lib/showcaseData';
import { MemberDetailModal } from '@/components/ui/MemberDetailModal';

interface TestimonialsProps {
  dict: Dictionary;
  showcase?: ShowcaseConfig;
}

export function Testimonials({ dict, showcase }: TestimonialsProps) {
  const [selectedMember, setSelectedMember] = React.useState<MemberStory | null>(null);

  // We use the first 3 members from dynamic showcase or fallback PRESTASI_MEMBERS
  const testimonials = (showcase?.prestasiMembers || PRESTASI_MEMBERS).slice(0, 3);

  return (
    <section id="testimonials" className="relative bg-bg py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header: Left (Eyebrow + Title), Right (Lead + CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <MotionReveal variant="fade-up">
              <Eyebrow variant="dot">{dict.testimonials.eyebrow}</Eyebrow>
            </MotionReveal>
            <MotionReveal variant="fade-up" delay={0.1}>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.02em] leading-[1.12] text-text-1">
                {dict.testimonials.title}
              </h2>
            </MotionReveal>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <MotionReveal variant="fade-up" delay={0.2}>
              <p className="text-body-lg text-text-2 leading-relaxed mb-6">
                {dict.testimonials.lead}
              </p>
              <div>
                <Button variant="solid" href="#join">
                  {dict.testimonials.cta}
                </Button>
              </div>
            </MotionReveal>
          </div>
        </div>

        {/* Wide Photo Banner with Floating Testimonial Cards */}
        <MotionReveal variant="scale" delay={0.15}>
          <div className="relative rounded-none overflow-hidden shadow-photo bg-brand-soft border border-hairline/60 p-6 sm:p-10 lg:p-12">
            {/* Background Real Campus Photo */}
            <Image
              src="/campus.jpg"
              alt="SMKN 1 Surabaya Campus & IT Club"
              fill
              className="object-cover brightness-[0.88] contrast-[1.05] transition-transform duration-1000 hover:scale-[1.01]"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            {/* Soft sage overlay */}
            <div className="absolute inset-0 bg-brand/30 backdrop-blur-[1px] pointer-events-none" />

            {/* Cards Grid floating on top */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMember(item)}
                  className="bg-surface/95 backdrop-blur-md rounded-none border border-hairline p-6 sm:p-7 shadow-float flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-brand/60 cursor-pointer group"
                >
                  <div>
                    {/* Avatar thumbnail + Name & Role */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div
                        className={`size-12 rounded-none ${item.avatarBg} text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105`}
                      >
                        <span className="font-mono text-[12px] font-bold tracking-wider">
                          {item.avatarInitial}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-text-1 leading-snug group-hover:text-brand transition-colors">
                          {item.name}
                        </p>
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

                  {/* Bottom link: Read story → */}
                  <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between font-mono text-[10px] text-text-3">
                    <span className="text-text-1 font-medium group-hover:text-brand group-hover:underline flex items-center gap-1">
                      <span>Baca Kisah & Profil Lengkap →</span>
                    </span>
                    <span className="text-brand font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span className="size-1 bg-brand rounded-none inline-block" />
                      VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Member Profile Modal */}
      <MemberDetailModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}