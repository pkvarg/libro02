'use client'
import { io } from 'socket.io-client'
import { createContext, useContext, useEffect, useState } from 'react'

//const socketHttp = io('ws://localhost:3001')

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  usersOnline: any
  addUsers: (value: any) => void
  getUsers: (value: any) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  usersOnline: [],
  addUsers: null,
  getUsers: null,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [usersOnline, setUsersOnline] = useState([])

  const socketInstance = io('ws://localhost:3001')
  //const usersOnline = ['me']

  const addUsers = (userEmail) => {
    socketInstance.emit('addUser', userEmail)
  }

  const getUsers = () => {
    socketInstance.on('getUsers', (activeUsers) => {
      console.log(activeUsers)
      activeUsers.map(
        (user) => !usersOnline.includes(user) && usersOnline.push(user)
      )
    })
  }

  console.log('uO', usersOnline)

  useEffect(() => {
    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    getUsers()

    setSocket(socketInstance)

    //socketInstance.on('addUser', (userEmail) => {})

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        usersOnline,
        getUsers,
        addUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
