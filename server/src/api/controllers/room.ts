import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import { Server, Socket } from 'socket.io'

@SocketController()
export class Room {
  @OnMessage('join_game')
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    console.log('New user joining room: ', message)

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId)
    const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id)

    if (socketRooms.length > 0 || connectedSockets?.size === 2) {
      socket.emit('room_joined_error', {
        error: 'The room is full! Please choose another room to play.',
      })
    } else {
      await socket.join(message.roomId)
      socket.emit('room_joined')

      if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
        io.in(message.roomId).emit('on_two_players')
      }
    }
  }
}
