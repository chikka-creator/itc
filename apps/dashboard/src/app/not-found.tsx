import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-bg">
      <div className="bg-surface border border-hairline p-8 max-w-md w-full rounded-none space-y-5 text-center shadow-md">
        <div className="text-5xl font-mono font-bold text-text-1">404</div>

        <div>
          <h2 className="text-lg font-bold text-text-1 font-sans">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs text-text-2 font-mono mt-1.5 leading-relaxed">
            Halaman yang Anda tuju tidak tersedia atau Anda tidak memiliki akses ke rute ini.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none inline-flex items-center gap-2 transition-colors font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
