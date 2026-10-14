'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-surface border border-hairline p-8 max-w-md w-full rounded-none space-y-5 text-center shadow-lg">
        <div className="inline-flex p-3 bg-red-50 border border-red-200 text-red-600 rounded-none mb-1">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-text-1 font-sans">
            Terjadi Kesalahan Sistem
          </h2>
          <p className="text-xs text-text-2 font-mono mt-2 leading-relaxed">
            {error.message ||
              'Aplikasi mengalami kendala saat memproses permintaan Anda. Silakan coba muat ulang halaman.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none inline-flex items-center justify-center gap-2 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 border border-hairline text-text-1 hover:bg-neutral-100 text-xs font-mono uppercase tracking-wider rounded-none inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
