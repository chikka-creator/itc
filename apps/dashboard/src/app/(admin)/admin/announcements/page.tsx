import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, announcements, desc } from '@itc/db';
import { AnnouncementsAdminClient } from './AnnouncementsAdminClient';

export default async function AdminAnnouncementsPage() {
  await requireAdmin();

  const allAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.pinned), desc(announcements.createdAt))
    .all();

  return <AnnouncementsAdminClient initialAnnouncements={allAnnouncements} />;
}
