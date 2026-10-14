import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db, users, eq } from '@itc/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'itc-super-secret-jwt-key-2026-very-secure',
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const usernameStr = String(credentials.username).trim().toLowerCase();
        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, usernameStr))
          .get();

        if (!user) return null;

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );
        if (!valid) return null;

        // Update lastLoginAt
        await db
          .update(users)
          .set({ lastLoginAt: new Date() })
          .where(eq(users.id, user.id));

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
});
