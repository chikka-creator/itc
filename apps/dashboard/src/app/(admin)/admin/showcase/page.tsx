import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, settings, users, eq, asc } from '@itc/db';
import { ShowcaseAdminClient } from './ShowcaseAdminClient';

export const metadata = {
  title: 'Manajemen Showcase Karya & Member | Admin IT Club',
};

export default async function AdminShowcasePage() {
  await requireAdmin();

  const record = await db
    .select()
    .from(settings)
    .where(eq(settings.key, 'showcase_config'))
    .get();

  let initialConfig = null;
  if (record && record.value) {
    try {
      initialConfig = JSON.parse(record.value);
    } catch {
      initialConfig = null;
    }
  }

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: users.role,
      className: users.className,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
    })
    .from(users)
    .orderBy(asc(users.name))
    .all();

  return (
    <ShowcaseAdminClient
      initialConfig={initialConfig}
      registeredUsers={allUsers}
    />
  );
}
