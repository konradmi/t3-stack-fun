import NextAuth, { Session, Account } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

import type { User } from '../../../types/auth'

import prisma from '../../../lib/prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { type: 'text' },
        password: { type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { username, password } = credentials
        const user = await prisma.users.findFirst({
          where: {
            username
          }
        })

        if (!user) throw new Error('User does not exist')

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) throw new Error('Incorrect Password')
        // features can be taken from the db. the user feature is only for demo purposes
        if (isPasswordValid) return { username: user.username, id: user.id.toString(), features: ['user'] } as User

        return null
      },
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn() {
     return true
    },
    async jwt({ token, user, account }: { token: JWT, user: User | AdapterUser, account: Account | null }) {
      if (account?.provider === 'credentials' && user) {
        // with the credentials provider, user is the object returned from the authorize method
        token.user = user
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT}) {
      session.user = token.user
      return session
    }
  }
}

export default NextAuth(authOptions)
