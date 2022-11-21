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
  public async stopGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
    const room = this.getSocketGameRoom(socket)

    io.in(room).emit('on_game_stop', this.movingPlayerId)
    this.movingPlayerId = ''
    io.in(room).emit('on_player_move_id', this.movingPlayerId)
  }

  @OnMessage('play_game')
  public async playGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
    const room = this.getSocketGameRoom(socket)

    if (!this.movingPlayerId) {
      this.movingPlayerId = socket.id
      io.in(room).emit('on_player_move_id', this.movingPlayerId)
    }

    socket.to(room).emit('on_game_play')
  }
}
