import NextAuth from 'next-auth'
import { JWT } from "next-auth/jwt"
import type { User } from '../../../types/auth'

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User
  }

  // this User should be the same as in the ../../../types/auth.ts but I can't assign one type to the other
  interface User {
    id: string
    username: string
    features: string[]
  }
}


declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User
  }
}
