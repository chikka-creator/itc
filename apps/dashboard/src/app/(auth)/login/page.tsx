import React, { Suspense } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg text-text-1 relative overflow-hidden">
      {/* Soft botanical sage ambient glow matching landing page palette */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-none blur-[120px] pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(124, 140, 107, 0.45) 0%, rgba(243, 243, 241, 0) 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Reticle Frame Corner Marks */}
        <div className="relative p-8 md:p-10 border border-hairline bg-surface/95 backdrop-blur-md rounded-none shadow-2xl">
          {/* Corner + marks */}
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

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base text-brand font-bold">✳</span>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-3 font-semibold">
                IT CLUB • SMKN 1 SURABAYA
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-text-1">
              Portal Masuk Sistem
            </h1>
            <p className="text-xs text-text-2 mt-1.5 leading-relaxed">
              Masukkan nama pengguna dan kata sandi akun Anda untuk mengakses sistem.
            </p>
          </div>

          {/* Login Form wrapped in Suspense for searchParams */}
          <Suspense fallback={<div className="font-mono text-xs text-text-3">Memuat form...</div>}>
            <LoginForm />
          </Suspense>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-hairline-soft flex items-center justify-between text-[11px] font-mono text-text-3">
            <Link href="http://localhost:3000" className="hover:text-text-1 transition-colors">
              ← Kembali ke Beranda
            </Link>
            <span className="text-[10px] text-text-3 font-medium">
              SISTEM AUTENTIKASI RESMI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
