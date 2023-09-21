'use client'
import { io } from 'socket.io-client'
import { createContext, useContext, useEffect, useState } from 'react'

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  usersOnline: any
  addUsers: (value: any) => void
  getUsers: (value: any) => void
  sendMessages: (value: any) => void
  receiveMessage: () => void
  whoIsOtherUser: (value: any) => void
  received: string
  socketInstance: any
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  usersOnline: [],
  addUsers: null,
  getUsers: null,
  sendMessages: null,
  receiveMessage: null,
  whoIsOtherUser: null,
  received: null,
  socketInstance: null,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [usersOnline, setUsersOnline] = useState([])
  const [received, setReceived] = useState('')

  //const socketInstance = io()
  //const socketInstance = new (ClientIO as any)('ws://localhost:3001')

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

  const whoIsOtherUser = (email: string) => {
    console.log(email)
  }

  // const sendMessages = (message) => {
  //   socketInstance?.emit('sendMessage', message)
  // }

  const sendMessages = (message) => {
    console.log('front', message)
    socketInstance.emit('input-change', message)
  }

  // const receiveMessage = () => {
  //   socketInstance?.on('receiveMessage', (data) => {
  //     console.log('rcv', data)
  //   })
  // }

  const receiveMessage = () => {
    console.log(received)
    return received
  }

  useEffect(() => {
    const socketInitializer = () => {
      console.log('volame front')

      socketInstance?.on('connect', () => {
        console.log('connected')
        setIsConnected(true)
      })

      socketInstance.on('update-input', (msg) => {
        console.log('effect', msg)
        setReceived(msg)
      })

      socketInstance?.on('disconnect', () => {
        setIsConnected(false)
      })
    }

    socketInstance?.on('disconnect', () => {
      setIsConnected(false)
    })

    getUsers()

    setSocket(socketInstance)

    console.log(isConnected)

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
        getUsers,
        addUsers,
        sendMessages,
        receiveMessage,
        whoIsOtherUser,
        received,
        socketInstance,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
