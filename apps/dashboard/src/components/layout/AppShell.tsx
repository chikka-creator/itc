'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  Trophy,
  Bell,
  Settings,
  Users,
  CheckSquare,
  BarChart3,
  LogOut,
  FolderTree,
  Megaphone,
  Menu,
  X,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    role?: string;
    username?: string;
  };
  isAdminLayout?: boolean;
}

export function AppShell({ children, user, isAdminLayout = false }: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch {
        // ignore
      }
    };
    fetchUnread();
  }, [pathname]);

  interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const memberNav: NavItem[] = [
    { label: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
    { label: 'TUGAS AKTIF', href: '/assignments', icon: BookOpen },
    { label: 'RIWAYAT SUBMISI', href: '/submissions', icon: FileCheck },
    { label: 'LEADERBOARD', href: '/leaderboard', icon: Trophy },
    {
      label: 'NOTIFIKASI',
      href: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'PENGATURAN', href: '/settings', icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { label: 'OVERVIEW', href: '/admin', icon: LayoutDashboard },
    { label: 'MANAJEMEN USER', href: '/admin/users', icon: Users },
    { label: 'TUGAS & MATERI', href: '/admin/assignments', icon: BookOpen },
    { label: 'KATEGORI', href: '/admin/categories', icon: FolderTree },
    { label: 'PENILAIAN', href: '/admin/grading', icon: FileCheck },
    { label: 'ABSENSI', href: '/admin/attendance', icon: CheckSquare },
    { label: 'PENGUMUMAN', href: '/admin/announcements', icon: Megaphone },
    { label: 'GALERI FOTO', href: '/admin/gallery', icon: ImageIcon },
    { label: 'SHOWCASE LANDING', href: '/admin/showcase', icon: Sparkles },
    { label: 'LAPORAN & CSV', href: '/admin/reports', icon: BarChart3 },
    { label: 'PENGATURAN SISTEM', href: '/admin/settings', icon: Settings },
  ];

  const navItems: NavItem[] = isAdminLayout ? adminNav : memberNav;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen flex bg-bg text-text-1">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-hairline bg-surface flex flex-col justify-between shrink-0 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="h-16 border-b border-hairline px-6 flex items-center justify-between bg-surface">
            <Link
              href={isAdminLayout ? '/admin' : '/dashboard'}
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileOpen(false)}
            >
              <span className="font-mono text-base text-brand font-bold">✳</span>
              <span className="font-mono text-xs tracking-widest text-text-1 uppercase font-semibold group-hover:text-brand transition-colors">
                IT CLUB • PORTAL
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-text-3 hover:text-text-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Indicator */}
          <div className="px-6 py-4 border-b border-hairline-soft bg-bg-alt/50">
            <div className="text-[10px] font-mono tracking-widest text-text-3 uppercase flex items-center justify-between">
              <span>{isAdminLayout ? 'PANEL ADMINISTRATOR' : 'PORTAL EKSKUL'}</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-none bg-emerald-600 inline-block animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' &&
                  item.href !== '/dashboard' &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs font-mono tracking-wider transition-all border ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111] font-medium shadow-sm'
                      : 'border-transparent text-text-2 hover:text-text-1 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`size-4 rounded-none font-mono text-[9px] font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-brand text-white'
                          : 'bg-neutral-900 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Switch Mode */}
        <div className="p-4 border-t border-hairline bg-surface space-y-3">
          {user.role === 'admin' && (
            <div className="px-2">
              <Link
                href={isAdminLayout ? '/dashboard' : '/admin'}
                className="text-[10px] font-mono tracking-wider text-text-2 hover:text-text-1 hover:underline block"
              >
                {isAdminLayout ? '⇄ Masuk ke Mode Anggota' : '⇄ Masuk ke Mode Admin'}
              </Link>
            </div>
          )}

          <div className="p-3 bg-bg border border-hairline rounded-none flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-mono text-text-1 truncate font-semibold">
                {user.name || user.username}
              </div>
              <div className="text-[10px] font-mono text-text-3 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 inline-block" />
                <span>{user.role === 'admin' ? 'PENGURUS EKSKUL' : 'ANGGOTA EKSKUL'}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar dari sistem"
              className="p-1.5 text-text-3 hover:text-red-700 hover:bg-red-50 rounded-none transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-hairline bg-surface/90 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 text-xs font-mono text-text-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 text-text-2 hover:text-text-1"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline">SMK NEGERI 1 SURABAYA</span>
            <span className="hidden sm:inline text-text-3/60">/</span>
            <span className="text-text-1 uppercase font-semibold">
              {isAdminLayout ? 'ADMINISTRATION' : 'PORTAL EKSKUL IT CLUB'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative p-2 text-text-2 hover:text-text-1 transition-colors"
              title="Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-none bg-emerald-600 animate-pulse" />
              )}
            </Link>

            <span className="text-xs font-mono text-text-3 hidden sm:inline">
              USER: <span className="text-text-1 font-semibold">{user.username}</span>
            </span>

            <button
              onClick={handleLogout}
              className="font-mono text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-none bg-[#111111] text-white hover:bg-[#2E2E2E] border border-[#111111] transition-colors"
            >
              Keluar
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main id="main" className="flex-1 p-5 sm:p-8 overflow-y-auto bg-bg text-text-1">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
