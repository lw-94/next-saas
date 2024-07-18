import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/server/db/schema'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GithubProvider, GoogleProvider],
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     return !!auth
  //   },
  // }
})
