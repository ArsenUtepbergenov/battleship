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
  }

  public play(): void {
    if (!this.field.isReady) {
      Notifications.create({
        text: Messages.NotAllShipsError,
        type: NotificationType.ERROR,
      })

      return
    }

    this.field.freeze()
    this.unsetControls()
    this.controller.setState(GameState.PLAY)
  }

  public setControls(): void {
    const playButton = new Button({ id: 'play-button', text: 'play' })
    const resetAllButton = new Button({ id: 'reset-all-button', text: 'reset all' })
    const undoLastButton = new Button({ id: 'undo-button', text: 'undo last' })

    playButton.click = () => this.play()
    resetAllButton.click = () => this.reset()
    undoLastButton.click = () => this.undoLastAction()

    this.controls.push(playButton, resetAllButton, undoLastButton)

    this.appendControls()

    this.controller.attach(playButton)
    this.controller.attach(resetAllButton)
    this.controller.attach(undoLastButton)
  }

  public reset(): void {
    this.field.clear()
    this.controller.setState(GameState.RUN)
  }

  public undoLastAction(): void {
    this.field.undo()
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
