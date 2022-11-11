import Field from '@/entities/Field'
import BackgroundGrid from '@/entities/BackgroundGrid'
import { createShips, Ship } from '@/entities/Ship'
import Button from '@/components/controls/Button'
import GameController from '@/entities/GameController'
import { GameState } from '@/models/enums'

export default class Battleship {
  private controller: GameController = new GameController()
  private backgroundGrid: BackgroundGrid = new BackgroundGrid()
  private field: Field = new Field()
  private ships: Ship[] = []
  private controls: Button[] = []

  public run(): void {
    this.backgroundGrid.draw()
    this.createShips()
    this.putShipsToSpot()
    this.createControls()
  }

  public play(): void {
    if (!this.field.isReady) return

    this.field.freeze()
    this.unsetControls()
    this.controller.setState(GameState.PLAY)
  }

  public createControls(): void {
    const playButton = new Button({ id: 'play-button', text: 'play' })
    const resetAllButton = new Button({ id: 'reset-all-button', text: 'reset all' })
    const undoLastButton = new Button({ id: 'undo-button', text: 'undo last' })

    playButton.click = () => this.play()
    resetAllButton.click = () => this.reset()
    undoLastButton.click = () => this.undoLastAction()

    this.controls.push(playButton, resetAllButton, undoLastButton)

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
