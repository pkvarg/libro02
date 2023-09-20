'use client'
import { io } from 'socket.io-client'
import { createContext, useContext, useEffect, useState } from 'react'

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  usersOnline: any
  // addUsers: (value: any) => void
  // getUsers: (value: any) => void
  // sendMessages: (value: any) => void
  // receiveMessage: () => void
  socketInstance: any
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  usersOnline: [],
  // addUsers: null,
  // getUsers: null,
  // sendMessages: null,
  // receiveMessage: null,
  socketInstance: null,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [usersOnline, setUsersOnline] = useState([])

  const socketInstance = io()
  //const socketInstance = new (ClientIO as any)('ws://localhost:3001')

  //const socketInstance = io('ws://localhost:3001')
  //const usersOnline = ['me']

  // const addUsers = (userEmail) => {
  //   socketInstance.emit('addUser', userEmail)
  // }

  // const getUsers = () => {
  //   socketInstance.on('getUsers', (activeUsers) => {
  //     console.log(activeUsers)
  //     activeUsers.map(
  //       (user) => !usersOnline.includes(user) && usersOnline.push(user)
  //     )
  //   })
  // }

  // const sendMessages = (message) => {
  //   socketInstance?.emit('sendMessage', message)
  // }

  // const receiveMessage = () => {
  //   socketInstance?.on('receiveMessage', (data) => {
  //     console.log('rcv', data)
  //   })
  // }

  useEffect(() => {
    const socketInitializer = async () => {
      console.log('volame front')
      await fetch('/api/socket')

      socketInstance.on('connect', () => {
        console.log('connected')
        setIsConnected(true)
      })

      socketInstance?.on('disconnect', () => {
        setIsConnected(false)
      })
    }

    // socketInstance.on('connect', () => {
    //   setIsConnected(true)
    // })

    // socketInstance?.on('disconnect', () => {
    //   setIsConnected(false)
    // })

    // getUsers()
    // receiveMessage()

    setSocket(socketInstance)

    console.log(isConnected)
    //socketInstance.on('addUser', (userEmail) => {})

    socketInitializer()

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
        // getUsers,
        // addUsers,
        // sendMessages,
        // receiveMessage,
        socketInstance,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
