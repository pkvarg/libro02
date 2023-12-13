import Ably from 'ably/promises'
import { NextApiRequest, NextApiResponse } from 'next'

export const ably = new Ably.Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('we are in api/ably GET')
  const channel = ably.channels.get('your-channel')
  channel.subscribe('your-event', (message) => {
    console.log('Received message on api:', message.data)
  })

  // const channel = ably.channels.get('your-channel')
  // channel.subscribe('your-event', (message) => {
  //   console.log('Received message:', message.data)
  // })

  res.status(200).end()

  // const tokenRequestData = await client.auth.createTokenRequest({
  //   clientId: 'ably-nextjs-demo',
  // })
  // return res.json(tokenRequestData)
}
