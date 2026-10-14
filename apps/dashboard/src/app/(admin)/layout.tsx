import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import { AppShell } from '@/components/layout/AppShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AppShell user={user} isAdminLayout={true}>
      {children}
    </AppShell>
  );
}
