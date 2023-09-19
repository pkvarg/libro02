'use client'
import { io } from 'socket.io-client'
import { createContext, useContext, useEffect, useState } from 'react'

//const socketHttp = io('ws://localhost:3001')

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  socketUsers: any
  addUsers: (value: any) => void
  setSocketUsers: (value: any) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  socketUsers: [],
  addUsers: null,
  setSocketUsers: null,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [socketUsers, setSocketUsers] = useState([])

  const usersOnline = []

  const addUsers = () => {
    console.log('add')
  }

  useEffect(() => {
    const socketInstance = io('ws://localhost:3001')

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socketInstance)

    socketInstance.on('getUsers', (activeUsers) => {
      activeUsers.map((user) => usersOnline.push(user.userEmail))
      setSocketUsers(usersOnline)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, socketUsers, addUsers, setSocketUsers }}
    >
      {children}
    </SocketContext.Provider>
  )
}
