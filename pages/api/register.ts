import bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import createRegisterToken from '@/libs/createRegisterToken'
import { prismaAuth as prisma } from '@/libs/prismadb'
import axios from 'axios'
import siteUrl from '@/libs/siteUrl'
import isRateLimited, { clientIp } from '@/libs/rateLimit'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME = /^[a-zA-Z0-9._-]{3,30}$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  if (isRateLimited(`register:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return res.status(429).json('Príliš veľa pokusov, skúste to neskôr')
  }

  try {
    const { email, username, name, password, url, consent } = req.body

    // Registration requires explicit consent (see /privacy); the time is kept as proof.
    if (consent !== true) {
      return res.status(400).json('Chýba súhlas so spracúvaním osobných údajov')
    }
    if (typeof email !== 'string' || !EMAIL.test(email) || email.length > 200) {
      return res.status(400).json('Neplatný e-mail')
    }
    if (typeof name !== 'string' || !name.trim() || name.length > 80) {
      return res.status(400).json('Vyplňte meno')
    }
    if (typeof username !== 'string' || !USERNAME.test(username)) {
      return res.status(400).json('Užívateľské meno: 3–30 znakov, písmená, čísla, bodka, pomlčka alebo podčiarkovník')
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 200) {
      return res.status(400).json('Heslo musí mať aspoň 8 znakov')
    }

    // An existing e-mail gets the same answer as a new one, so the form does not reveal who is a member.
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (existing) {
      return res.status(200).json('OK')
    }
    const takenUsername = await prisma.user.findUnique({ where: { username }, select: { id: true } })
    if (takenUsername) {
      return res.status(409).json('Toto užívateľské meno je už obsadené')
    }

    const { registerToken, registerTokenExpires, registerURL } = await createRegisterToken(email, siteUrl(url))

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        username,
        name: name.trim(),
        hashedPassword,
        isRegistered: false,
        registerToken,
        registerTokenExpires,
        consentAt: new Date(),
      },
    })

    const apiUrl = 'https://hono-api.pictusweb.com/api/librosophia/register'

    const origin = 'LIBROSOPHIA'

    try {
      await axios.put(
        apiUrl,
        { name, email, username, registerUrl: registerURL, origin },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      return res.status(200).json('OK')
    } catch (error) {
      console.log(error)
      return res.status(400).end()
    }
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
