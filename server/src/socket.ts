import 'reflect-metadata'
import { useSocketServer } from 'socket-controllers'
import { Server } from 'socket.io'

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })

  // After building need to change the extension .ts -> .js
  useSocketServer(io, { controllers: [__dirname + '/api/controllers/*.ts'] })

  return io
}
