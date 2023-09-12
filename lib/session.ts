import type { NextAuthOptions, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

import jsonwebtoken from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: '',
      clientSecret: '',
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
