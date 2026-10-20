import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { users, accounts, authSessions, verificationTokens } from './db/schema';
import { cloudConfigured } from './lib/cloud';
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter:
    db && cloudConfigured
      ? DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
          sessionsTable: authSessions,
          verificationTokensTable: verificationTokens,
        })
      : undefined,
  providers: cloudConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : [],
  session: { strategy: cloudConfigured ? 'database' : 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: '/', error: '/' },
  callbacks: {
    session({ session, user }) {
      if (user) session.user.id = user.id;
      return session;
    },
  },
});
