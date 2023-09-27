import { Server } from 'socket.io'

const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:3000', 'https://librosophia.sk'],
  },
})

let allClients = new Set()

// io.sockets.on('connection', function(socket) {
//   allClients.add(socket.id);

//   socket.on('disconnect', function() {
//     console.log('Got disconnect!');

//     allClients.delete(socket.id);
//   });
// });

const activeUsers = []

const addUser = (userEmail, socketId) => {
  !activeUsers.some((user) => user.socketId === socketId) &&
    !activeUsers.some((user) => user.userEmail === userEmail) &&
    activeUsers.push({ userEmail, socketId })
}

const removeUser = (email) => {
  console.log('removing', email)
  activeUsers.map((user) => console.log('logged', user))
  //activeUsers.filter((user) => user.userEmail !== email)
}

// const getUser = (username) => {
//   return users.find((user) => user.username === username)
// }

// io.on('connection', (socket) => {
//   // when connect
//   //activeUsers.push(socket.id)
//   console.log(`User Connected: ${socket.id}`)

//   // Take userEmail
//   socket.on('addUser', (userEmail) => {
//     if (userEmail) {
//       addUser(userEmail, socket.id)
//       io.emit('getUsers', activeUsers)
//       console.log('added3001', activeUsers)
//     }
//     // })

//     // send and get message

//     socket.on('sendMessage', (data) => {
//       console.log('dataSM:', data)
//       io.emit('receiveMessage', data)
//       // io.to(UserId).emit('receiveMessage', data)
//     })

//     socket.on('alpha', (data) => {
//       console.log(data)
//     })

//     // when disconnect
//     socket.on('disconnect', () => {
//       console.log('User Disconnected', socket.id)
//       removeUser(socket.id)
//       io.emit('getUsers', activeUsers)
//       console.log('afterDisconnect:', activeUsers)
//     })
//   })
// })

io.on('connection', (socket) => {
  socket.on('input-change', (msg) => {
    console.log('server', msg)
    socket.broadcast.emit('update-input', msg)
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
    // io.emit('getUsers', activeUsers)
    // console.log('afterDisconnect:', activeUsers)
  })

  // socket.on('disconnect', () => {
  //   console.log('User Disconnected',)
  //   removeUser(userEmail)
  //   io.emit('getUsers', activeUsers)
  //   console.log('afterDisconnect:', activeUsers)
  // })
})
