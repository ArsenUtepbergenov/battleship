import Field from '@/entities/Field'
import BackgroundGrid from '@/entities/BackgroundGrid'
import { createShips, Ship } from '@/entities/Ship'
import { GameState } from '@/models'

export default class Battleship {
  private state: GameState = GameState.START
  private backgroundGrid: BackgroundGrid = new BackgroundGrid()
  private field: Field = new Field()
  private ships: Ship[] = []

  public run(): void {
    this.backgroundGrid.draw()
    this.createShips()
    this.putShipsToSpot()
    this.state = GameState.RUN
  }

  public play(): void {
    if (this.state !== GameState.RUN) return

    this.field.freeze()
    this.state = GameState.PLAY
  }

  public reset(): void {
    this.field.clear()
    this.state = GameState.START
  }

  public undoLastAction(): void {
    this.field.undo()
  }

  public get isStatePlay(): boolean {
    return this.state === GameState.PLAY
  }

  private putShipsToSpot(): void {
    this.field.setShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
