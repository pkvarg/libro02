import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:3000', 'https://librosophia.sk'],
  },
})

const activeUsers = []

const addUser = (userEmail, socketId) => {
  !activeUsers.some((email) => email === userEmail) &&
    //activeUsers.push({ userEmail, socketId })
    activeUsers.push(userEmail)

  console.log('UsersArray', activeUsers)
}

const removeUser = (socketId) => {
  activeUsers.filter((user) => user.socketId !== socketId)
}

// const getUser = (username) => {
//   return users.find((user) => user.username === username)
// }

io.on('connection', (socket) => {
  // when connect
  //activeUsers.push(socket.id)
  console.log(`User Connected: ${socket.id}`)

  // Take userEmail
  socket.on('addUser', (userEmail) => {
    if (userEmail) {
      addUser(userEmail, socket.id)
      io.emit('getUsers', activeUsers)
      console.log('added3001', activeUsers)
    }
    // })

    // send and get message

    socket.on('sendMessage', (data) => {
      console.log('data:', data)
      io.emit('receiveMessage', data)
      // io.to(UserId).emit('receiveMessage', data)
    })

    socket.on('alpha', (data) => {
      console.log(data)
    })

    // when disconnect
    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id)
      removeUser(socket.id)
      io.emit('getUsers', activeUsers)
      console.log('afterDisconnect:', activeUsers)
    })
  })
})
