import Field from '@/entities/Field'
import Button from '@/components/controls/Button'
import BackgroundGrid from '@/entities/BackgroundGrid'
import GameController from '@/entities/GameController'
import Notification from '@/components/notifications/Notification'
import { Messages } from '@/models'
import { createShips, Ship } from '@/entities/Ship'
import { GameState, NotificationType } from '@/models/enums'

export default class Battleship {
  private controller: GameController = new GameController()
  private backgroundGrid: BackgroundGrid = new BackgroundGrid()
  private field: Field = new Field()
  private ships: Ship[] = []
  private controls: Button[] = []

  public run(): void {
    this.backgroundGrid.appendTo('field')
    this.backgroundGrid.draw()
    this.createShips()
    this.putShipsToSpot()
    this.setControls()
  }

  public play(): void {
    if (!this.field.isReady) {
      const notification = new Notification({
        text: Messages.NotAllShipsError,
        type: NotificationType.ERROR,
      })
      notification.appendTo('notifications-container')

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
