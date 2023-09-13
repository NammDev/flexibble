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
    logo: '/logo.png',
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string
      try {
        const data = (await getUser(session?.user?.email as string)) as { user?: UserProfile }
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        }
        return newSession
      } catch (error) {
        console.log(error)
        return session
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        // get the user from database if they exists
        const userExists = (await getUser(user?.email as string)) as { user?: UserProfile }
        // if they don't, create them
        if (!userExists) {
          await createUser(user.name as string, user.email as string, user.image as string)
        }
        return true
      } catch (error) {
        console.log(`Sign in Error: ${error}`)
        return false
      }
    },
  },
  //   callbacks: {
  //     async session({ session }) {
  //       // store the user id from MongoDB to session
  //       const sessionUser = await User.findOne({ email: session.user?.email })

  //       session.user.id = sessionUser._id.toString()

  //       return session
  //     },
  //     async signIn({ user }) {
  //       try {
  //         await connectToDB()

  //         // check if user already exsist
  //         const userExists = await User.findOne({ email: user?.email })

  //         // if not, create a new user
  //         if (!userExists) {
  //           await User.create({
  //             email: user?.email,
  //             username: user.name?.replace(' ', '').toLowerCase(),
  //             image: user?.image,
  //           })
  //         }

  //         return true
  //       } catch (error) {
  //         console.log(error)
  //         return false
  //       }
  //     },
  //   },
}

export async function getCurrentUser() {
  const session = (await getServerSession(options)) as SessionInterface
  return session
}
