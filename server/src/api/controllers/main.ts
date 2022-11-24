import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import { Server, Socket } from 'socket.io'
import Log from '../../utils/log'

@SocketController()
export class Main {
  @OnConnect()
  public onConnect(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
    Log.it(`New socket %${socket.id} connected.`, 32)
  }

  @OnDisconnect()
  public onDisconnect(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
    Log.it(`The socket %${socket.id} disconnected.`, 31)
  }
}
