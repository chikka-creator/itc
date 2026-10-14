'use client';

import * as React from 'react';
import type { Dictionary } from '@/lib/i18n';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import { IsometricKeyboard } from '@/components/ui/IsometricKeyboard';
import { MotionReveal } from '@/components/ui/MotionReveal';

export function Integrations({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="integrations"
      className="relative bg-bg pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 border-t border-hairline/60 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center relative z-10">
        {/* Header Content with Staggered Entrance */}
        <div className="max-w-3xl mx-auto relative z-20">
          <MotionReveal variant="fade-up">
            <Eyebrow variant="dot" center>
              {dict.integrations.eyebrow}
            </Eyebrow>
          </MotionReveal>
          <MotionReveal variant="fade-up" delay={0.1}>
            <h2 className="mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold tracking-[-0.025em] leading-[1.08] text-text-1">
              {dict.integrations.title}
            </h2>
          </MotionReveal>
          <MotionReveal variant="fade-up" delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg text-text-2 leading-relaxed">
              {dict.integrations.lead}
            </p>
          </MotionReveal>
          <MotionReveal variant="fade-up" delay={0.3}>
            <div className="mt-8 flex justify-center relative z-20">
              <Button variant="solid" href="#join">
                {dict.integrations.cta}
              </Button>
            </div>
          </MotionReveal>
        </div>

        {/* 3D Isometric Keyboard Stage */}
        <MotionReveal variant="scale" delay={0.2} className="mt-8 sm:mt-10 md:mt-12 relative w-full z-10">
          <IsometricKeyboard />
        </MotionReveal>
      </div>
    </section>
  );
}