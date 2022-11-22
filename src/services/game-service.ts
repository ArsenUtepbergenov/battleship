import { IPoint } from '@/models/types'
import { Socket } from 'socket.io-client'

class GameService {
  public movingPlayerId = ''
  public playersCanPlay = 0
  public twoPlayersInRoom = false

  public reset(): void {
    this.playersCanPlay = 0
    this.movingPlayerId = ''
  }

  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      socket.emit('join_game', { roomId })

      socket.on('room_joined', () => resolve(true))
      socket.on('room_joined_error', ({ error }) => reject(error))
    })
  }

  // start/play
  public async playGame(socket: Socket) {
    socket.emit('play_game', !this.movingPlayerId ? socket.id : '')
  }

  public async onPlayersCanPlay(socket: Socket) {
    socket.on('on_players_can_play', () => this.playersCanPlay++)
  }

  public async onGamePlay(socket: Socket, listener: () => void) {
    socket.on('on_game_play', listener)
  }

  public async onTwoPlayersJoined(socket: Socket, listener: () => void) {
    socket.on('on_two_players', () => {
      this.twoPlayersInRoom = true
      listener()
    })
  }

  // update
  public async hit(socket: Socket, isHit: boolean) {
    socket.emit('hit', isHit)
  }

  public async onHit(socket: Socket, listener: (isHit: boolean) => void) {
    socket.on('on_hit', listener)
  }

  public async onPlayerMoveId(socket: Socket) {
    socket.on('on_player_move_id', id => (this.movingPlayerId = id))
  }

  public async updateGame(socket: Socket, position: IPoint) {
    socket.emit('update_game', { position })
  }

  public async onGameUpdate(socket: Socket, listener: (position: IPoint) => void) {
    socket.on('on_game_update', ({ position }) => listener(position))
  }

  // stop
  public async stopGame(socket: Socket) {
    this.reset()
    socket.emit('stop_game')
  }

  public async onGameStop(socket: Socket, listener: (id: string) => void) {
    socket.on('on_game_stop', listener)
  }

  public async terminateGame(socket: Socket) {
    this.reset()
    socket.emit('terminate_game')
  }

  public async onGameTerminate(socket: Socket, listener: () => void) {
    socket.on('on_game_terminate', listener)
  }
}

export default new GameService()
