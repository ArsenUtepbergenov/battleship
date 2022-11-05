import { Ship } from '@/entities/Ship'
import { Config } from '@/models'
import Utilities from '@/utils'
import Canvas from './Canvas'

export default class Field {
  private field: Canvas
  private c: CanvasRenderingContext2D
  private ships: Ship[] = []
  private currentActiveShip: Ship | null = null

  constructor() {
    this.field = new Canvas()
    this.field.init({
      parentElement: 'field',
      id: 'game',
      width: Config.size + Config.shipsSpotSize,
      height: Config.size,
    })

    this.c = this.field.ctx

    this.setHandlers()
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.c
  }

  public putShips(ships: Ship[]): void {
    this.ships = ships
    this.drawShips()
  }

  private setHandlers(): void {
    this.setMouseDown()
    this.setMouseUp()
  }

  private setMouseDown(): void {
    this.field.mouseDown = event => {
      const mousePosition = Utilities.getMouseCoordinates(event)

      for (const ship of this.ships) {
        if (Utilities.rectPointCollision(mousePosition, ship)) {
          this.currentActiveShip = ship
        }
      }
    }
  }

  private setMouseUp(): void {
    this.field.mouseUp = event => {
      this.currentActiveShip = null
    }
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw())
  }
}
