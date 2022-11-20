import { ConnectedSocket, MessageBody, OnMessage, SocketController } from 'socket-controllers'
import { Socket } from 'socket.io'

@SocketController()
export class Game {
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id)
    const room = socketRooms?.length && socketRooms[0]

    return room
  }

  @OnMessage('update_game')
  public async updateGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    const room = this.getSocketGameRoom(socket)
    socket.to(room).emit('on_game_update', message)
  }

  @OnMessage('stop_game')
  public async stopGame(@ConnectedSocket() socket: Socket) {
    const room = this.getSocketGameRoom(socket)
    socket.to(room).emit('on_game_stop')
  }

  @OnMessage('play_game')
  public async playGame(@ConnectedSocket() socket: Socket) {
    const room = this.getSocketGameRoom(socket)
    socket.broadcast.to(room).emit('on_game_play')
  }
}
