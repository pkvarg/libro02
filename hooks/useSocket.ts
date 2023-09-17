import { create } from 'zustand'
import { socketHttp } from '@/lib/socketHttp'
import { userAgent } from 'next/server'

interface socketStore {
  socketUsers: any
  socketConnected: boolean
  addUsers: (value: any) => void
  setSocketUsers: (value: any) => void
}

const useSocket = create<socketStore>((set) => {
  let usersOnline = []

  if (socketHttp.connected) {
    socketHttp.on('getUsers', (activeUsers) => {
      activeUsers.map((user) => usersOnline.push(user.userEmail))
    })
  } else {
    usersOnline = []
  }

  console.log(socketHttp)

  return {
    socketUsers: usersOnline,
    socketConnected: socketHttp.connected,
    addUsers: (value) => socketHttp.emit('addUser', value),
    setSocketUsers: (value) => set({ socketUsers: value }),
    // Optional: Clean up socket connection on component unmount
    //onCleanup: () => socket.disconnect(),
  }
})

export default useSocket
