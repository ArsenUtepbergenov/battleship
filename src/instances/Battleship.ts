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

    const stopCallback = () => {
      Notifications.create({
        text: Messages.PlayerSurrendered,
        type: ColorType.INFO,
        lifeTime: 3500,
      })
    }

    gameService.onStartGame(socketService.socket, startCallback)
    gameService.onGameStop(socketService.socket, stopCallback)
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

  private over(): void {
    // if (!socketService.socket) return

    this.setHandlers()
    this.controller.setState(GameState.OVER)
    this.overButton.disable()
    this.overButton.click = null

    Notifications.create({
      text: Messages.GameIsOver,
      type: ColorType.INFO,
      lifeTime: 4500,
    })

    // gameService.stopGame(socketService.socket)
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
