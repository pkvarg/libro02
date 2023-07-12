/* Nodemailer class for sending Welcome email*/
class Email {
  email: String
  url: String
  constructor(email: String, url: String) {
    this.email = email
    this.url = url
  }

  newTransport() {
    let nodemailer = require('nodemailer')
    return nodemailer.createTransport({
      pool: true,
      host: 'smtp.titan.email',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.NODEJS_USERNAME,
        pass: process.env.NODEJS_PASSWORD,
      },
    })
  }

  async send() {
    const mailOptions = {
      from: 'nodejs@pictusweb.sk',
      to: this.email,
      subject: 'Obnova hesla',
      html: `<div>
      <p>Obnovte si heslo cez link nižšie</p>
      <a href=${this.url}>Link</a>
      <p>Librosophia</p>
      </div>`,
    }

    await this.newTransport().sendMail(mailOptions)
  }
}

export default Email
