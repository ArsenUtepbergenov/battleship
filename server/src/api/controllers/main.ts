import { ConnectedSocket, OnConnect, SocketController, SocketIO } from 'socket-controllers'
import { Server, Socket } from 'socket.io'

@SocketController()
export class Main {
  @OnConnect()
  public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
    console.log('New socket connected: ', socket.id)
  }
}
