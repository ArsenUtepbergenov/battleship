import Field from '@/entities/Field'
import Button from '@/components/controls/Button'
import Notifications from '@/entities/Notifications'
import GameController from '@/entities/GameController'
import { Messages } from '@/models'
import { createShips, Ship } from '@/entities/Ship'
import { GameState, NotificationType } from '@/models/enums'
import FightField from '@/entities/FightField'

export default class Battleship {
  private controller!: GameController
  private field!: Field
  private fightField!: FightField
  private ships!: Ship[]
  private controls!: Button[]
  private overButton!: Button

  public run(): void {
    this.controller = new GameController()
    this.field = new Field()
    this.fightField = new FightField()
    this.ships = []
    this.controls = [
      new Button({ id: 'play-button', text: 'play' }),
      new Button({ id: 'reset-button', text: 'reset' }),
      new Button({ id: 'undo-button', text: 'undo' }),
    ]
    this.overButton = new Button({ id: 'over-button', text: 'over' })

    this.createShips()
    this.putShipsToSpot()
    this.setControls()
    this.controller.attach(this.field)
    this.controller.attach(this.fightField)
    this.controller.setState(GameState.START)
  }

  private setHandlers(): void {
    this.controls[0].click = () => this.play()
    this.controls[1].click = () => this.field.reset()
    this.controls[2].click = () => this.field.undo()
  }

  private over(): void {
    this.setHandlers()
    this.controller.setState(GameState.OVER)
    this.overButton.disable()
    this.overButton.click = () => this.over()

    Notifications.create({
      text: Messages.GameIsOver,
      type: NotificationType.INFO,
      lifeTime: 4500,
    })
  }

  private play(): void {
    if (!this.field.isReady) {
      Notifications.create({
        text: Messages.NotAllShipsOnField,
        type: NotificationType.ERROR,
      })

      return
    }

    this.unsetControls()
    this.controller.setState(GameState.PLAY)
    this.overButton.undisable()
    this.overButton.click = () => this.over()

    Notifications.create({
      text: Messages.GameHasStarted,
      type: NotificationType.SUCCESS,
      lifeTime: 3500,
    })
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
