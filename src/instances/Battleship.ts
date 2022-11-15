import Field from '@/entities/Field'
import Button from '@/components/controls/Button'
import Notifications from '@/entities/Notifications'
import GameController from '@/entities/GameController'
import { Messages } from '@/models'
import { createShips, Ship } from '@/entities/Ship'
import { GameState, NotificationType } from '@/models/enums'
import FightField from '@/entities/FightField'

export default class Battleship {
  private controller = new GameController()
  private field = new Field()
  private fightField = new FightField()
  private ships: Ship[] = []
  private controls: Button[] = []

  public run(): void {
    this.createShips()
    this.putShipsToSpot()
    this.setControls()
    this.controller.attach(this.field)
    this.controller.attach(this.fightField)
    this.controller.setState(GameState.START)
  }

  public over(): void {
    this.controller.setState(GameState.OVER)
  }

  public play(): void {
    if (!this.field.isReady) {
      Notifications.create({
        text: Messages.NotAllShipsOnField,
        type: NotificationType.ERROR,
      })

      return
    }

    this.unsetControls()
    this.controller.setState(GameState.PLAY)

    Notifications.create({
      text: Messages.GameHasStarted,
      type: NotificationType.SUCCESS,
      lifeTime: 3500,
    })
  }

  public setControls(): void {
    const playButton = new Button({ id: 'play-button', text: 'play' })
    const resetButton = new Button({ id: 'reset-button', text: 'reset' })
    const undoButton = new Button({ id: 'undo-button', text: 'undo' })

    playButton.click = () => this.play()
    resetButton.click = () => this.field.reset()
    undoButton.click = () => this.field.undo()

    this.controls.push(playButton, resetButton, undoButton)

    this.appendControls()
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
