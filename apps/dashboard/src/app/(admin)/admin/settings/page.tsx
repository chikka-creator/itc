import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, settings } from '@itc/db';
import { AdminSettingsClient } from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  await requireAdmin();

  const allSettings = await db.select().from(settings).all();
  const configMap: Record<string, any> = {};

  for (const item of allSettings) {
    try {
      configMap[item.key] = JSON.parse(item.value);
    } catch {
      configMap[item.key] = item.value;
    }
  }

  return <AdminSettingsClient initialSettings={configMap} />;
}
