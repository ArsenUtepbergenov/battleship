import gameService from '@/services/game-service'
import socketService from '@/services/socket-service'
import Field from '@/entities/Field'
import Button from '@/components/controls/Button'
import Notifications from '@/entities/Notifications'
import GameController from '@/entities/GameController'
import { Messages } from '@/models'
import { createShips, Ship } from '@/entities/Ship'
import { GameState, ColorType } from '@/models/enums'
import FightField from '@/entities/FightField'
import { IPoint } from '@/models/types'

export default class Battleship {
  private controller = new GameController()
  private field!: Field
  private fightField!: FightField
  private ships: Ship[] = []
  private controls: Button[] = [
    new Button({ id: 'play-button', text: 'play' }),
    new Button({ id: 'reset-button', text: 'reset' }),
    new Button({ id: 'undo-button', text: 'undo' }),
  ]
  private overButton = new Button({ id: 'over-button', text: 'over' })

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

    const shootCallback = (position: IPoint) => {
      this.field.shoot(position)
      gameService.isPlayerTurn = false
    }

    gameService.onGameUpdate(socketService.socket, shootCallback)
  }

  public handleGameStart(): void {
    if (!socketService.socket) return

    const startCallback = () => {
      Notifications.create({
        text: Messages.TwoPlayersInRoom,
        type: ColorType.SUCCESS,
        lifeTime: 3500,
      })
    }

    gameService.onStartGame(socketService.socket, startCallback)
  }

  private setHandlers(): void {
    this.controls[0].click = () => this.play()
    this.controls[1].click = () => this.field.reset()
    this.controls[2].click = () => this.field.undo()
  }

  private over(): void {
    if (!socketService.socket) return

    this.setHandlers()
    this.controller.setState(GameState.OVER)
    this.overButton.disable()
    this.overButton.click = null

    Notifications.create({
      text: Messages.GameIsOver,
      type: ColorType.INFO,
      lifeTime: 4500,
    })

    gameService.stopUpdateGame(socketService.socket)
  }

  private play(): void {
    if (!this.field.isReady) {
      Notifications.create({
        text: Messages.NotAllShipsOnField,
        type: ColorType.ERROR,
      })

      return
    }

    this.unsetControls()
    this.controller.setState(GameState.PLAY)
    this.overButton.undisable()
    this.overButton.click = () => this.over()

    Notifications.create({
      text: Messages.GameHasStarted,
      type: ColorType.SUCCESS,
      lifeTime: 3500,
    })

    this.handleGameUpdate()
  }

  private setControls(): void {
    this.setHandlers()

    this.overButton.disable()

    this.appendControls()
    this.overButton.appendTo('controls')

    this.attachControls()
  }

  private attachControls(): void {
    this.controls.forEach(c => this.controller.attach(c))
  }

  private appendControls(): void {
    this.controls.forEach(c => c.appendTo('controls'))
  }

  private unsetControls(): void {
    this.controls.forEach(c => (c.click = null))
  }

  private putShipsToSpot(): void {
    this.field.setShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
