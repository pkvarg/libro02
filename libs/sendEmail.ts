const SENDGRID_API = 'https://api.sendgrid.com/v3/mail/send'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

const sendEmail = async (name: String, email: String) => {
  console.log('sE:', email, name)

  await fetch(SENDGRID_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          subject: 'Demo success :)',
        },
      ],
      from: {
        email: 'noreply@demo.com',
        name: 'Test SendGrid',
      },
      content: [
        {
          type: 'text/html',
          value: `Congratulations <b>${name}</b>, you just sent an email with sendGrid`,
        },
      ],
    }),
  })
}

export { sendEmail }
