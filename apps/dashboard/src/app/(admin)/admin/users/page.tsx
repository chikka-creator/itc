import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { db, users, desc } from '@itc/db';
import { UsersClient } from './UsersClient';

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      role: users.role,
      className: users.className,
      phone: users.phone,
      bio: users.bio,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .all();

  return <UsersClient initialUsers={allUsers} currentAdminId={currentAdmin.id} />;
}
