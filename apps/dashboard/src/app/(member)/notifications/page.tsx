import React from 'react';
import { requireUser } from '@/lib/permissions';
import { db, notifications, eq, or, desc, isNull } from '@itc/db';
import { NotificationsClient } from './NotificationsClient';

export default async function NotificationsPage() {
  const user = await requireUser();

  const userNotifications = await db
    .select()
    .from(notifications)
    .where(or(eq(notifications.userId, user.id), isNull(notifications.userId)))
    .orderBy(desc(notifications.createdAt))
    .all();

  const formatted = userNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    type: n.type,
    read: n.read,
    createdAtStr: new Date(n.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 mb-1.5">
          <span>• NOTIFIKASI & PENGUMUMAN •</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Pemberitahuan Sistem
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          PANTAU INFORMASI TUGAS BARU, PENGINGAT DEADLINE, DAN MASUKAN PENILAIAN DARI PENGURUS
        </p>
      </div>

      <NotificationsClient initialNotifications={formatted} />
    </div>
  );
}
