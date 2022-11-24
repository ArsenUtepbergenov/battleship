import { Socket } from 'socket.io-client'
import Field from '@/entities/Field'
import FightField from '@/entities/FightField'
import gameService from '@/services/game-service'
import Button from '@/components/controls/Button'
import Buttons from '@/components/controls/Controls'
import socketService from '@/services/socket-service'
import GameController from '@/entities/GameController'
import { IPoint } from '@/models/types'
import { GameState } from '@/models/enums'
import { notify } from '@/entities/Notifications'
import { createShips, Ship } from '@/entities/Ship'

export default class Battleship {
  private controller = new GameController()
  private field!: Field
  private fightField!: FightField
  private ships: Ship[] = []
  private buttons = Buttons
  private overButton = new Button({ id: 'over-button', text: 'replay' })
  private ws: Socket | null = null

  private static instance: Battleship
  private constructor() {}

  public static getInstance() {
    if (!this.instance) this.instance = new Battleship()
    return this.instance
  }

  public run(): void {
    this.field = new Field()
    this.fightField = new FightField()
    this.createShips()
    this.putShipsToSpot()
    this.setControls()
    this.controller.attach(this.field)
    this.controller.attach(this.fightField)
    this.controller.setState(GameState.START)
    this.ws = socketService.socket
    this.handleGameStart()
  }

  private handleGameStart(): void {
    if (!this.ws) return

    gameService.onPlayersCanPlay(this.ws)
    gameService.onGamePlay(this.ws, () => notify('PlayerPlaying'))
    gameService.onTwoPlayersJoined(this.ws, () => notify('TwoPlayersInRoom'))
    gameService.onGameStop(this.ws, (winnerId: string) => {
      if (!this.ws) return

      this.fightField.unsetHandlers()
      this.fightField.resetCursor()

      if (this.ws.id === winnerId) {
        notify('PlayerWon')
        return
      }
      notify('GameIsOver')
    })
    gameService.onGameTerminate(this.ws, () => this.over())
    gameService.onPlayerMoveId(this.ws)
    gameService.onGameUpdate(this.ws, (position: IPoint) => this.field.shoot(position))
  }

  private over(): void {
    if (!this.ws) return

    this.reset()
    notify('GameIsOver')
  }

  private play(): void {
    if (!this.canPlay || !this.ws) return

    this.unsetControls()
    this.controller.setState(GameState.PLAY)
    this.overButton.undisable()
    this.overButton.click = () => {
      if (!this.ws) return

      gameService.terminateGame(this.ws)
    }

    gameService.playGame(this.ws)
  }

  private reset(): void {
    this.setHandlers()
    this.controller.setState(GameState.OVER)
    this.overButton.disable()
    this.overButton.click = null
  }

  private get canPlay(): boolean {
    if (!this.field.isReady) {
      notify('NotAllShipsOnField')
      return false
    }
    if (!gameService.twoPlayersInRoom) {
      notify('NoTwoPlayersInRoom')
      return false
    }
    return true
  }

  private setHandlers(): void {
    this.buttons.setClick([
      () => this.play(),
      () => this.field.reset(),
      () => this.field.undo(),
      () => this.field.putShipsToRandom(),
    ])

    document.onkeydown = event => {
      if (event.code === 'Enter') this.play()
      return true
    }
  }

  private setControls(): void {
    this.setHandlers()

    this.overButton.disable()

    this.buttons.append('controls')
    this.overButton.appendTo('controls')

    this.attachControls()
  }

  private attachControls(): void {
    this.buttons.getAll.forEach(c => this.controller.attach(c))
  }

  private unsetControls(): void {
    this.buttons.unsetClick()
    document.onkeydown = null
  }

  private putShipsToSpot(): void {
    this.field.setShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
