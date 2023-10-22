'use client'
import { io } from 'socket.io-client'
import { createContext, useContext, useEffect, useState } from 'react'

//export const exportedSocket = io('ws://localhost:3001')

type SocketContextType = {
  socket: any | null
  isConnected: boolean
  usersOnline: any
  addUsers: (value: any) => void
  getUsers: (value: any) => void
  disconnectUser: (value: any) => void
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
  disconnectUser: null,
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

  //const socketInstance = new (ClientIO as any)('ws://localhost:3001')

  const socketInstance = io('ws://localhost:3001')
  // for online version just io()
  //const socketInstance = io()

  const addUsers = (userEmail) => {
    socketInstance.emit('addUser', userEmail)
  }

  const getUsers = () => {
    socketInstance.on('getUsers', (activeUsers) => {
      console.log(activeUsers)
      for (const obj of activeUsers) {
        const { userEmail, socketId } = obj

        const alreadyExists = usersOnline.some(
          (item) => item.userEmail === userEmail
        )

        if (!alreadyExists) {
          usersOnline.push({ userEmail, socketId })
        }
      }
    })
  }

  const disconnectUser = (email) => {
    console.log('discon', email)
    socketInstance.emit('dis', email)
    const remaining = usersOnline.filter((user) => user.userEmail !== email)
    console.log('rem', remaining)
    setUsersOnline(remaining)
    console.log('uO', usersOnline)
  }

  const whoIsOtherUser = (email: string) => {
    console.log(email)
  }

  const sendMessages = (message) => {
    console.log('front', message)
    socketInstance.emit('input-change', message)
  }

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
        console.log('inst', 'dison')
      })
    }

    getUsers()

    setSocket(socketInstance)

    console.log(isConnected)

    socketInitializer()

    return () => {
      socketInstance.disconnect()
      console.log('ret disc')
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
        disconnectUser,
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
