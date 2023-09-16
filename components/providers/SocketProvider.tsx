'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'
import { socketHttp } from '@/lib/socketHttp'

type SocketContextType = {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (socketHttp.connected) {
      setIsConnected(true)
    }
  }, [socketHttp])

  // useEffect(() => {
  //   const socketInstance = new (ClientIO as any)(
  //     process.env.NEXT_PUBLIC_SITE_URL!,
  //     {
  //       path: '/api/socket/io',
  //       addTrailingSlash: false,
  //     }
  //   )

  //   socketInstance.on('connect', () => {
  //     setIsConnected(true)
  //   })

  //   socketInstance.on('disconnect', () => {
  //     setIsConnected(false)
  //   })

  //   setSocket(socketInstance)

  //   return () => {
  //     socketInstance.disconnect()
  //   }
  // }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
