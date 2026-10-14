import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthRoute = pathname.startsWith('/login');
      const isProtectedRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/assignments') ||
        pathname.startsWith('/submissions') ||
        pathname.startsWith('/leaderboard') ||
        pathname.startsWith('/notifications') ||
        pathname.startsWith('/settings') ||
        pathname.startsWith('/admin');

      if (isProtectedRoute) {
        if (!isLoggedIn) return false;

        // Admin subroute guard
        if (pathname.startsWith('/admin')) {
          const role = (auth?.user as { role?: string })?.role;
          if (role !== 'admin') {
            return Response.redirect(new URL('/dashboard', nextUrl));
          }
        }
        return true;
      }

      if (isAuthRoute && isLoggedIn) {
        const role = (auth?.user as { role?: string })?.role;
        if (role === 'admin') {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
  },
  providers: [],
};
