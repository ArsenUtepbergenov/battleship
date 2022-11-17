import { Socket } from 'socket.io-client'

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit('join_game', { roomId })

      socket.on('join_room', () => resolve(true))
      socket.on('join_room_error', ({ error }) => reject(error))
    })
  }
}

export default new GameService()
