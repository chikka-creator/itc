import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, gallery, asc } from '@itc/db';
import { GalleryAdminClient } from './GalleryAdminClient';

export default async function AdminGalleryPage() {
  await requireAdmin();

  const items = await db
    .select()
    .from(gallery)
    .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt))
    .all();

  return <GalleryAdminClient initialGallery={items} />;
}
