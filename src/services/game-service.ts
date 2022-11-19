import { IPoint } from '@/models/types'
import { Socket } from 'socket.io-client'

class GameService {
  public isPlayerTurn = false

  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit('join_game', { roomId })

      socket.on('room_joined', () => resolve(true))
      socket.on('room_joined_error', ({ error }) => reject(error))
    })
  }

  // start
  public async onStartGame(socket: Socket, listener: () => void) {
    socket.on('game_can_start', listener)
  }

  // update
  public async updateGame(socket: Socket, position: IPoint) {
    socket.emit('update_game', { position })
  }

  public async onGameUpdate(socket: Socket, listener: (position: IPoint) => void) {
    socket.on('on_game_update', ({ position }) => listener(position))
  }

  // stop
  public async stopGame(socket: Socket) {
    socket.removeAllListeners('on_game_update')
    socket.emit('stop_game')
  }

  public async onGameStop(socket: Socket, listener: () => void) {
    socket.on('on_game_stop', listener)
  }
}

export default new GameService()
