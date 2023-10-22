import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:3000', 'https://librosophia.sk'],
  },
})

let activeUsers = []

const addUser = (userEmail, socketId) => {
  !activeUsers.some((user) => user.socketId === socketId) &&
    !activeUsers.some((user) => user.userEmail === userEmail) &&
    activeUsers.push({ userEmail, socketId })
}

const removeUser = (email) => {
  let removingSocketId
  console.log('removing', email)
  activeUsers.find((user) => {
    if (user.userEmail === email) removingSocketId = user.socketId
  })
  activeUsers = activeUsers.filter((user) => user.socketId !== removingSocketId)

  io.emit('getUsers', activeUsers)
  console.log('afterDisconnect:', activeUsers)
}

io.on('connection', (socket) => {
  socket.on('input-change', (msg) => {
    console.log('server', msg.body)
    socket.broadcast.emit('update-input', msg)
  })
  socket.on('send-message', (msg) => {
    console.log('obg-server', msg.body)
    socket.broadcast.emit('receive-message', msg)
  })
  socket.on('addUser', (userEmail) => {
    if (userEmail) {
      addUser(userEmail, socket.id)
      io.emit('getUsers', activeUsers)
      console.log('added3001', activeUsers)
    }
  })

  socket.on('dis', (email) => {
    removeUser(email)
  })
})
