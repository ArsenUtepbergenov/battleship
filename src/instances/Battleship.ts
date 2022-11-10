import Field from '@/entities/Field'
import BackgroundGrid from '@/entities/BackgroundGrid'
import { createShips, Ship } from '@/entities/Ship'
import { GameState } from '@/models'

export default class Battleship {
  private state: GameState = GameState.START
  private backgroundGrid: BackgroundGrid
  private field: Field
  private ships: Ship[] = []

  constructor() {
    this.backgroundGrid = new BackgroundGrid()
    this.field = new Field()
  }

  public run(): void {
    this.backgroundGrid.draw()
    this.createShips()
    this.putShipsToSpot()
    this.state = GameState.RUN
  }

  public play(): void {
    this.state === GameState.RUN && this.field.freeze()
  }

  public reset(): void {
    this.field.clear()
    this.state = GameState.START
  }

  public undoLastAction(): void {
    this.field.undo()
  }

  private putShipsToSpot(): void {
    this.field.putShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips()
  }
}
