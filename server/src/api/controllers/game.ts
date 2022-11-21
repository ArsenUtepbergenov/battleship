import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from 'socket-controllers'
import { Server, Socket } from 'socket.io'

@SocketController()
export class Game {
  private movingPlayerId = ''

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id)
    const room = socketRooms?.length && socketRooms[0]

    return room
  }

  @OnMessage('hit')
  public async hit(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() isHit: boolean,
  ) {
    const room = this.getSocketGameRoom(socket)
    if (!isHit) this.movingPlayerId = socket.id

    io.in(room).emit('on_player_move_id', this.movingPlayerId)
    socket.to(room).emit('on_hit', isHit)
  }

  @OnMessage('update_game')
  public async updateGame(@ConnectedSocket() socket: Socket, @MessageBody() position: any) {
    const room = this.getSocketGameRoom(socket)
    socket.to(room).emit('on_game_update', position)
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
