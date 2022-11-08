import Field from '@/entities/Field'
import BackgroundGrid from '@/entities/BackgroundGrid'
import { createShips, Ship } from '@/entities/Ship'

export default class Battleship {
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
    this.putShipsToField()
  }

  public rerun(): void {
    this.field.clear()
  }

  private putShipsToField(): void {
    this.field.putShips(this.ships)
  }

  private createShips(): void {
    this.ships = createShips(this.field.ctx)
  }
}
