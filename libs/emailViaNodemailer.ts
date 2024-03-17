/* Nodemailer class for sending Welcome email*/
class Email {
  email: String
  username: String
  name: String
  type: String
  url: String

  constructor(
    email: String,
    username: String,
    name: String,
    type: String,
    url: String
    //console.log(email, username, name, type, url)
  ) {
    this.email = email
    this.username = username
    this.name = name
    this.type = type
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
    const passwordResetData = {
      from: process.env.EMAIL_FROM,
      to: this.email,
      subject: 'Obnova hesla',
      html: `<div>
      <p>Obnovte si heslo cez link nižšie</p>
      <a href=${this.url}>Link</a>
      <p>Librosophia</p>
      </div>`,
    }
    const time = new Date()

    const adminMailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.NODEJS_BCC,
      subject: `Nová registrácia ${this.name}`,
      text: `${this.email}`,
      html: `<div>
      <p>Na Librosophii sa registroval nový užívateľ</p>
      <p>užívateľské meno: ${this.username}</p>
      <p>meno: ${this.name}</p>
      <p>email: ${this.email}</p>
      <p>čas: ${time}</p>
      </div>`,
    }

    const userMailData = {
      from: process.env.EMAIL_FROM,
      to: `${this.email}`,
      subject: `Vitaj na Librospohia ${this.name}`,
      html: `<div>
      <p>Vitaj na Librosophia</p>
      <p>užívateľské meno: ${this.username}</p>
      <p>meno: ${this.name}</p>
      <p>email: ${this.email}</p>
      <p>čas: ${time}</p>
      </div>`,
    }

    if (this.type === 'register-nodemailer') {
      await this.newTransport().sendMail(userMailData)
      await this.newTransport().sendMail(adminMailData)
    } else if (this.type === 'reset-password-nodemailer') {
      await this.newTransport().sendMail(passwordResetData)
    }
  }
}

export default Email
