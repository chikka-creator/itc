import React from 'react';
import { requireUser } from '@/lib/permissions';
import { AppShell } from '@/components/layout/AppShell';

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell user={user} isAdminLayout={false}>
      {children}
    </AppShell>
  );
}
