import NextAuth, { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

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
        if (isPasswordValid) return { username: user.username, id: user.id.toString(), features: ['user'] }

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
    async jwt({ token, user, account }: any) {
      if (account?.provider === 'credentials' && user) {
        // with the credentials provider, user is the object returned from the authorize method
        token.user = user
      }
      return token
    },
    async session({ session, token }: { session: Session, token: any}) {
      session.user = token.user
      return session
    }
  }
}

export default NextAuth(authOptions)
