import { NextApiRequest, NextApiResponse } from 'next'

export default function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  let nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    pool: true,
    host: 'smtp.titan.email',
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.NODEJS_USERNAME,
      pass: process.env.NODEJS_PASSWORD,
    },
  })

  const time = new Date()

  const adminMailData = {
    from: 'nodejs@pictusweb.sk',
    to: process.env.NODEJS_BCC,
    subject: `Nová registrácia ${req.body.name}`,
    text: req.body.email,
    html: `<div>
    <p>Na Librosophii sa registroval nový užívateľ</p>
    <p>užívateľské meno: ${req.body.username}</p>
    <p>meno: ${req.body.name}</p>
    <p>email: ${req.body.email}</p>
    <p>čas: ${time}</p>
    </div>`,
  }

  const userMailData = {
    from: 'nodejs@pictusweb.sk',
    to: `${req.body.email}`,
    subject: `Vitaj na Librospohia ${req.body.name}`,
    // text: req.body.email,
    html: `<div>
    <p>Vitaj na Librosophia</p>
    <p>užívateľské meno: ${req.body.username}</p>
    <p>meno: ${req.body.name}</p>
    <p>email: ${req.body.email}</p>
    <p>čas: ${time}</p>
    </div>`,
  }

  try {
    transporter.sendMail(adminMailData)
    transporter.sendMail(userMailData)
    return res.status(200).json(adminMailData)
  } catch (error) {
    console.log(error)
    return res.status(400).end()
  }
}
