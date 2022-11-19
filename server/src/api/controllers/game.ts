import { ConnectedSocket, MessageBody, OnMessage, SocketController } from 'socket-controllers'
import { Socket } from 'socket.io'

@SocketController()
export class Game {
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id)
    const gameRoom = socketRooms?.length && socketRooms[0]

    return gameRoom
  }

  @OnMessage('update_game')
  public async updateGame(@ConnectedSocket() socket: Socket, @MessageBody() message: any) {
    socket.to(this.getSocketGameRoom(socket)).emit('on_game_update', message)
  }
}
