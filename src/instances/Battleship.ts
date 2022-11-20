import Field from '@/entities/Field'
import FightField from '@/entities/FightField'
import gameService from '@/services/game-service'
import Button from '@/components/controls/Button'
import socketService from '@/services/socket-service'
import GameController from '@/entities/GameController'
import { IPoint } from '@/models/types'
import { GameState } from '@/models/enums'
import { notify } from '@/entities/Notifications'
import { createShips, Ship } from '@/entities/Ship'
import { appendControls, Controls, getControl, unsetControls } from '@/components/controls/Controls'

export default class Battleship {
  private controller = new GameController()
  private field!: Field
  private fightField!: FightField
  private ships: Ship[] = []
  private controls = Controls
  private overButton = new Button({ id: 'over-button', text: 'surrender' })

  public run(): void {
    this.field = new Field()
    this.fightField = new FightField()
    this.createShips()
    this.putShipsToSpot()
    this.setControls()
    this.controller.attach(this.field)
    this.controller.attach(this.fightField)
    this.controller.setState(GameState.START)
    this.handleGameStart()
  }

  public handleGameUpdate(): void {
    if (!socketService.socket) return

    const shoot = (position: IPoint) => {
      this.field.shoot(position)
      gameService.isPlayerTurn = false
    }

    gameService.onGameUpdate(socketService.socket, shoot)
  }

  public handleGameStart(): void {
    if (!socketService.socket) return

    gameService.onGamePlay(socketService.socket, () => notify('PlayerPlaying'))
    gameService.onTwoPlayersJoined(socketService.socket, () => notify('TwoPlayersInRoom'))
    gameService.onGameStop(socketService.socket, () => {
      notify('PlayerSurrendered')
      this.reset()
      gameService.reset()
    })
  }

  private over(): void {
    if (!socketService.socket) return

    this.reset()
    gameService.stopGame(socketService.socket)
    notify('GameIsOver')
  }

  private play(): void {
    if (!this.canPlay || !socketService.socket) return

    this.unsetControls()
    this.controller.setState(GameState.PLAY)
    this.overButton.undisable()
    this.overButton.click = () => this.over()

    this.handleGameUpdate()
    gameService.playGame(socketService.socket)
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
    getControl('play').click = () => this.play()
    getControl('reset').click = () => this.field.reset()
    getControl('undo').click = () => this.field.undo()
    document.onkeydown = event => {
      if (event.code === 'Enter') this.play()
      return true
    }
  }

  private setControls(): void {
    this.setHandlers()

    this.overButton.disable()

    appendControls('controls')
    this.overButton.appendTo('controls')

    this.attachControls()
  }

  private attachControls(): void {
    this.controls.forEach(c => this.controller.attach(c))
  }

  private unsetControls(): void {
    unsetControls()
    document.onkeydown = null
  }

  private putShipsToSpot(): void {
    this.field.setShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
