import { Server } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('socket')
  const io = new Server(4000, {
    cors: {
      origin: 'http://localhost:3000',
    },
  })

  io.on('connection', (socket) => {
    socket.on('input-change', (msg) => {
      console.log(msg)
      socket.broadcast.emit('update-input', msg)
    })
  })

  res.end()
}
