import { io } from 'socket.io-client'

export const socketHttp = io('ws://localhost:8990')
