'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/i18n';

interface HeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function Header({ dict, locale }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = React.useCallback(() => {
    const next: Locale = locale === 'id' ? 'en' : 'id';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }, [locale, router]);

  const links: { label: string; href: string }[] = [
    { label: dict.nav.home, href: '#' },
    { label: dict.nav.about, href: '#platform' },
    { label: dict.nav.features, href: '#features' },
    { label: locale === 'id' ? 'Daftar Ekskul' : 'Join Club', href: '#join' },
  ];

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-sm border-b border-hairline'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-5 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-text-1 flex items-center gap-2.5 group"
        >
          <div className="relative size-8 shrink-0 rounded-none overflow-hidden transition-transform group-hover:scale-105">
            <Image
              src="/Maskot-itc.png"
              alt="IT Club Mascot Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span>IT CLUB</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-2 hover:text-text-1 transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-2 hover:text-text-1 transition-colors duration-200"
            aria-label="Ganti bahasa / Switch language"
          >
            <span className={locale === 'id' ? 'text-text-1 font-semibold' : ''}>ID</span>
            <span className="opacity-40 mx-1.5">/</span>
            <span className={locale === 'en' ? 'text-text-1 font-semibold' : ''}>EN</span>
          </button>

          {/* Login button */}
          <a
            href="http://localhost:3001/login"
            className="hidden sm:inline-flex font-mono text-[10px] font-medium uppercase tracking-[0.1em] px-5 h-11 items-center justify-center rounded-none bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all duration-200 hover:-translate-y-px border border-[#111111] shadow-sm"
          >
            {dict.nav.login}
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-6 h-5 flex flex-col justify-between"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`block w-full h-px bg-text-1 transition-all duration-300 origin-center ${
                open ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-full h-px bg-text-1 transition-opacity duration-200 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-full h-px bg-text-1 transition-all duration-300 origin-center ${
                open ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-ease-out-expo ${
          open ? 'max-h-80 border-t border-hairline' : 'max-h-0'
        } bg-bg`}
      >
        <nav className="mx-auto max-w-[1240px] px-5 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-2 hover:text-text-1 py-2 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="http://localhost:3001/login"
            className="font-mono text-[10px] font-medium uppercase tracking-[0.1em] px-5 h-11 inline-flex items-center justify-center rounded-none bg-[#111111] text-white mt-2 border border-[#111111]"
          >
            {dict.nav.login}
          </a>
        </nav>
      </div>
    </header>
  );
}