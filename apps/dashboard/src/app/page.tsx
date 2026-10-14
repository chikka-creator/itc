import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardRootPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role;
  if (role === 'admin') {
    redirect('/admin');
  }

  redirect('/dashboard');
}
