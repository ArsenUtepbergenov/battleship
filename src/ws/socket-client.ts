import { io } from 'socket.io-client'

export default function connect() {
  const socket = io('http://localhost:9000')
}
