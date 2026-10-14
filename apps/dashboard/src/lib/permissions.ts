import { auth } from './auth';
import { redirect } from 'next/navigation';

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  username?: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  return (session?.user as AuthUser) ?? null;
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}
