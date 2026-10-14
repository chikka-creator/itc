'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  BookOpen,
  Clock,
  Trophy,
  Megaphone,
  Info,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  type: string;
  read: number;
  createdAtStr: string;
}

export function NotificationsClient({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const unreadCount = notifications.filter((n) => n.read === 0).length;

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: 1 })));
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: 1 } : n))
        );
        router.refresh();
      }
    } catch {
      // ignore
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.read === 0;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-brand" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'grade':
        return <Trophy className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-text-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface border border-hairline p-1 rounded-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-none transition-colors ${
              filter === 'all'
                ? 'bg-[#111111] text-white font-medium'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Semua ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-none transition-colors ${
              filter === 'unread'
                ? 'bg-[#111111] text-white font-medium'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Tandai Semua Sudah Dibaca</span>
          </button>
        )}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-hairline p-12 text-center rounded-none shadow-sm space-y-2">
          <Bell className="w-8 h-8 text-text-3 mx-auto" />
          <p className="font-mono text-xs text-text-3 uppercase tracking-wider">
            Tidak ada notifikasi saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 border transition-all rounded-none flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                n.read === 0
                  ? 'bg-surface border-text-1 shadow-sm'
                  : 'bg-surface/60 border-hairline hover:bg-surface'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-neutral-100 rounded-none shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm ${
                        n.read === 0 ? 'font-bold text-text-1' : 'font-medium text-text-2'
                      }`}
                    >
                      {n.title}
                    </h3>
                    {n.read === 0 && (
                      <span className="size-2 rounded-none bg-emerald-500 shrink-0" />
                    )}
                  </div>

                  {n.body && (
                    <p className="text-xs text-text-2 leading-relaxed max-w-2xl">
                      {n.body}
                    </p>
                  )}

                  <p className="font-mono text-[10px] text-text-3">
                    {n.createdAtStr} WIB
                  </p>
                </div>
              </div>

              {n.read === 0 && (
                <button
                  onClick={() => handleMarkOneRead(n.id)}
                  title="Tandai dibaca"
                  className="font-mono text-[10px] uppercase tracking-wider text-text-3 hover:text-text-1 border border-hairline px-2.5 py-1 rounded-none shrink-0 self-end sm:self-center"
                >
                  Tandai Dibaca
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
