import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import siteUrl from '@/libs/siteUrl'
import createResetToken from '@/libs/createResetToken'
import axios from 'axios'
import { honoHeaders } from '@/libs/honoApi'
import isRateLimited, { clientIp } from '@/libs/rateLimit'

export default async function forgotPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, url } = req.body

  if (
    isRateLimited(`forgot-ip:${clientIp(req)}`, 10, 60 * 60 * 1000) ||
    (typeof email === 'string' && isRateLimited(`forgot:${email.toLowerCase()}`, 3, 60 * 60 * 1000))
  ) {
    return res.status(429).json('Príliš veľa pokusov, skúste to neskôr')
  }

  try {
    const existingUser =
      typeof email === 'string' && email
        ? await prisma.user.findUnique({
            where: {
              email: email,
            },
          })
        : null

    // Only confirmed, active accounts get a link; every request gets the same answer.
    if (existingUser && existingUser.isRegistered && existingUser.active !== false) {
      const { resetURL } = await createResetToken(existingUser, siteUrl(url))

      const apiUrl = 'https://hono-api.pictusweb.com/api/librosophia/forgot'

      const origin = 'LIBROSOPHIA'

      await axios.put(
        apiUrl,
        {
          name: existingUser.name,
          email,
          resetUrl: resetURL,
          origin,
        },
        {
          headers: honoHeaders(),
        },
      )
    }
  } catch (error) {
    console.log(error)
  }

  return res.status(200).json('OK')
}
