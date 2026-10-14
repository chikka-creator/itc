import React from 'react';
import { requireUser } from '@/lib/permissions';
import { db, users, eq } from '@itc/db';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage() {
  const sessionUser = await requireUser();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .get();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 mb-1.5">
          <span>• AKUN & PREFERENSI •</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Pengaturan Akun
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          KELOLA INFORMASI PROFIL, GANTI PASSWORD, DAN SESUAIKAN PREFERENSI SISTEM
        </p>
      </div>

      <SettingsClient
        user={{
          name: user?.name || sessionUser.name || '',
          username: user?.username || sessionUser.username || '',
          className: user?.className || 'Anggota Ekskul',
          email: user?.email || '',
          role: user?.role || sessionUser.role || 'member',
          bio: user?.bio || '',
        }}
      />
    </div>
  );
}
