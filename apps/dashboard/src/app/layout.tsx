import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portal IT Club — SMK Negeri 1 Surabaya',
  description:
    'Portal pengumpulan tugas, penilaian, presensi pertemuan, dan leaderboard ekstrakurikuler IT Club SMKN 1 Surabaya.',
  keywords: ['IT Club', 'SMKN 1 Surabaya', 'Portal Tugas', 'Ekskul IT'],
  icons: {
    icon: '/Maskot-itc.png',
    apple: '/Maskot-itc.png',
  },
  openGraph: {
    title: 'Portal IT Club — SMK Negeri 1 Surabaya',
    description:
      'Portal pengumpulan tugas, penilaian, presensi pertemuan, dan leaderboard ekstrakurikuler IT Club SMKN 1 Surabaya.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased selection:bg-[#111111] selection:text-white bg-bg text-text-1 min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#111111] focus:text-white focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:outline-none"
        >
          Lewati ke konten utama
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
