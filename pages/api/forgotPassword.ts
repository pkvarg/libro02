import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import createResetToken from '@/libs/createResetToken'
import axios from 'axios'

export default async function forgotPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email, url, username } = req.body

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (existingUser) {
    const { resetURL, resetToken } = await createResetToken(existingUser, url)

    // hono api
    const apiUrl = 'https://hono-api.pictusweb.com/api/librosophia/forgot'
    //const apiUrl = 'http://localhost:3013/api/librosophia/forgot'

    const origin = 'LIBROSOPHIA'

    try {
      const apiResponse = await axios.put(
        apiUrl,
        {
          name: username,
          email,
          resetUrl: resetURL,
          origin,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      console.log('res', apiResponse)

      return res.status(200).json(resetToken)
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  }
}
