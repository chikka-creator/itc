import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/sections/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IT Club — SMKN 1 Surabaya',
  description: 'Portal tugas, absensi, dan peringkat Ekstrakurikuler IT Club SMK Negeri 1 Surabaya.',
  keywords: ['IT Club', 'SMKN 1 Surabaya', 'ekstrakurikuler', 'teknologi informasi'],
  openGraph: {
    title: 'IT Club — SMKN 1 Surabaya',
    description: 'Portal tugas, absensi, dan peringkat Ekstrakurikuler IT Club SMK Negeri 1 Surabaya.',
    type: 'website',
    locale: 'id_ID',
  },
  icons: {
    icon: '/Maskot-itc.png',
    apple: '/Maskot-itc.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getDictionary, getLocale } = await import('@/lib/i18n');
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-text-1 antialiased selection:bg-accent selection:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
        >
          {locale === 'id' ? 'Lewati ke konten' : 'Skip to content'}
        </a>
        <Header dict={dict} locale={locale} />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}