'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanUsername = username.trim().toLowerCase();

    try {
      const res = await signIn('credentials', {
        username: cleanUsername,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError('Nama pengguna atau kata sandi tidak valid.');
        setLoading(false);
        return;
      }

      // Query session to determine exact role for direct redirection
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const userRole = sessionData?.user?.role;

        if (userRole === 'admin') {
          // Admin account -> Direct redirect to /admin console
          const targetUrl = callbackUrl.startsWith('/admin') ? callbackUrl : '/admin';
          router.push(targetUrl);
        } else {
          // Member account -> Direct redirect to /dashboard
          const targetUrl = callbackUrl.startsWith('/admin') ? '/dashboard' : callbackUrl;
          router.push(targetUrl);
        }
        router.refresh();
      } catch {
        // Fallback role deduction
        if (cleanUsername === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan koneksi sistem. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-xs font-mono rounded-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-none bg-red-600 animate-pulse shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-mono tracking-wider text-text-2 uppercase mb-2">
          NAMA PENGGUNA (USERNAME)
        </label>
        <input
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username akun Anda"
          className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 focus:outline-none focus:border-text-1"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-[11px] font-mono tracking-wider text-text-2 uppercase mb-2">
          KATA SANDI (PASSWORD)
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-surface border border-hairline text-xs font-mono rounded-none text-text-1 focus:outline-none focus:border-text-1 pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#111111] text-white hover:bg-[#2E2E2E] font-mono text-xs tracking-widest uppercase transition-all rounded-none disabled:opacity-50 flex items-center justify-center gap-2 border border-[#111111] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>MEMVERIFIKASI & MENGALIHKAN...</span>
            </>
          ) : (
            <span>MASUK KE SISTEM →</span>
          )}
        </button>
      </div>
    </form>
  );
}
