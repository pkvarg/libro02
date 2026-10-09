import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { prismaAuth as prisma } from '@/libs/prismadb'
import isRateLimited, { clientIp } from '@/libs/rateLimit'

// Compared against when the e-mail is unknown, so both cases take the same time.
const DUMMY_HASH = '$2b$12$z5lEvcX3idm.bNX4nlQOxORmTcPyo0cUDUMCanOctiR7.d/j8wEiS'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Neplatné prihlasovacie údaje')
        }

        // Slows down password guessing: per e-mail and per IP.
        const ip = clientIp(req as any)
        if (
          isRateLimited(`login:${credentials.email.toLowerCase()}`, 10, 15 * 60 * 1000) ||
          isRateLimited(`login-ip:${ip}`, 30, 15 * 60 * 1000)
        ) {
          throw new Error('Príliš veľa pokusov, skúste to o chvíľu')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user?.hashedPassword) {
          await bcrypt.compare(credentials.password, DUMMY_HASH)
          throw new Error('Neplatné prihlasovacie údaje')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        // Wrong password, unconfirmed or blocked account: one message, so nothing is revealed.
        if (!isCorrectPassword || !user.isRegistered || user.active === false) {
          throw new Error('Neplatné prihlasovacie údaje')
        }

        return user
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
