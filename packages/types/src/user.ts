export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: UserRole;
  className: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;
