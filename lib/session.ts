import { getServerSession, type NextAuthOptions, type User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'
import { SessionInterface, UserProfile } from '@/common.types'
import { createUser, getUser } from './action'

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Flexibble',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'namkhanh' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // const res = await fetch('/your/endpoint', {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { 'Content-Type': 'application/json' },
        // })
        // const user = await res.json()
        const user = {
          id: '64',
          name: 'namkhanh',
          password: 'namkhanh',
          email: 'test@gmail.com',
        }

        // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user
        // }
        // if (user) return user
        if (credentials?.username === user.name && credentials.password === user.password) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: 'grafbase',
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      )

      return encodedToken
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret)
      return decodedToken as JWT
    },
  },
  theme: {
    colorScheme: 'light',
    logo: '/logo.svg',
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string

      try {
        const data = (await getUser(email)) as { user?: UserProfile }

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        }

        return newSession
      } catch (error: any) {
        console.error('Error retrieving user data: ', error.message)
        return session
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const userExists = (await getUser(user?.email as string)) as { user?: UserProfile }

        if (!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string)
        }

        return true
      } catch (error: any) {
        console.log('Error checking if user exists: ', error.message)
        return false
      }
    },
  },
}

export async function getCurrentUser() {
  const session = (await getServerSession(options)) as SessionInterface
  return session
}
