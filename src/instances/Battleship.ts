import Field from '@/entities/Field'
import BackgroundGrid from '@/entities/BackgroundGrid'
import { createShips, Ship } from '@/entities/Ship'
import { EventHandler, GameState } from '@/models'
import Button from '@/components/controls/Button'
import Controller from '@/entities/Controller'

export default class Battleship {
  private controller: Controller = new Controller()
  private state: GameState = GameState.START
  private backgroundGrid: BackgroundGrid = new BackgroundGrid()
  private field: Field = new Field()
  private ships: Ship[] = []
  private controls: Map<Button, EventHandler> = new Map()

  public run(): void {
    this.backgroundGrid.draw()
    this.createShips()
    this.putShipsToSpot()
    this.state = GameState.RUN
    this.createControls()
  }

  public play(): void {
    if (this.state !== GameState.RUN) return

    this.field.freeze()
    this.state = GameState.PLAY
  }

  public createControls(): void {
    const playButton = new Button({ id: 'play-button', text: 'play' })
    const resetAllButton = new Button({ id: 'reset-all-button', text: 'reset all' })
    const undoLastButton = new Button({ id: 'undo-button', text: 'undo last' })

    playButton.click = () => {
      this.play()
      this.unsetControls()
      this.controller.changeStateOfGame(this.state)
    }
    resetAllButton.click = () => this.reset()
    undoLastButton.click = () => this.undoLastAction()

    this.controls.set(playButton, playButton.click)
    this.controls.set(resetAllButton, resetAllButton.click)
    this.controls.set(undoLastButton, undoLastButton.click)

    this.controller.attach(playButton)
    this.controller.attach(resetAllButton)
    this.controller.attach(undoLastButton)
  }

  public reset(): void {
    this.field.clear()
    this.state = GameState.RUN
    this.controller.changeStateOfGame(this.state)
  }

  public undoLastAction(): void {
    this.field.undo()
  }

  private unsetControls(): void {
    this.controls.forEach((v, _) => (v = null))
  }

  private putShipsToSpot(): void {
    this.field.setShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
