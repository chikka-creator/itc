'use client';

import Image from 'next/image';
import type { Dictionary } from '@/lib/i18n';

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="bg-bg-dark text-text-1-dark">
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Newsletter */}
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-3-dark">
              <span className="inline-block mr-2 align-middle">●</span>
              {dict.footer.eyebrow}
            </p>
            <h2 className="mt-4 text-display-2 font-semibold tracking-[-0.015em] leading-[1.12]">
              {dict.footer.title}
            </h2>
            <p className="mt-4 text-body text-text-2-dark leading-relaxed max-w-[420px]">
              {dict.footer.lead}
            </p>

            <form
              className="mt-8 flex items-center gap-2 max-w-[420px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={dict.footer.placeholder}
                aria-label={dict.footer.placeholder}
                className="flex-1 h-11 px-4 rounded-none bg-surface-dark border border-hairline-dark text-[14px] text-text-1-dark placeholder:text-text-3-dark focus:outline-none focus:border-white/40"
              />
              <button
                type="submit"
                aria-label="Submit"
                className="h-11 w-11 shrink-0 rounded-none bg-[#111111] text-white border border-[#333333] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors shadow-sm"
              >
                →
              </button>
            </form>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {dict.footer.columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-text-3-dark mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-2-dark hover:text-text-1-dark transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant wordmark with Official Mascot */}
        <div className="mt-20 -mb-6 overflow-hidden">
          <div className="flex items-end gap-5 leading-none select-none">
            <div className="relative size-[clamp(3.5rem,10vw,8rem)] shrink-0 mb-1">
              <Image
                src="/Maskot-itc.png"
                alt="IT Club Mascot"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 128px"
              />
            </div>
            <span className="text-[clamp(4rem,14vw,12rem)] font-bold tracking-[-0.04em] leading-[0.8] text-text-1-dark">
              IT CLUB
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-hairline-dark flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3-dark">
            {dict.footer.rights}
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3-dark hover:text-text-1-dark transition-colors"
            >
              {dict.footer.privacy}
            </a>
            <a
              href="#"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-3-dark hover:text-text-1-dark transition-colors"
            >
              {dict.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}