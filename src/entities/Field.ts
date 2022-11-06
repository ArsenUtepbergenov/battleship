import { Ship } from '@/entities/Ship'
import { Config, Orientation } from '@/models'
import Utilities from '@/utils'
import Canvas from './Canvas'
import Point from './Point'

export default class Field {
  private field: Canvas
  private c: CanvasRenderingContext2D
  private ships: Ship[] = []
  private shipsStartPositions: Map<string, Point> = new Map()
  private currentShip: Ship | null = null
  private offset = new Point()
  private gridPositions: number[][]

  constructor() {
    this.field = new Canvas()
    this.field.init({
      parentElement: 'field',
      id: 'game',
      width: Config.size + Config.shipsSpotSize,
      height: Config.size,
    })

    this.gridPositions = Utilities.createMatrix(Config.gridPositionsSize, Config.gridPositionsSize)
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
    this.setMouseMove()
  }

  private setMouseDown(): void {
    this.field.mouseDown = event => {
      const mousePosition = Utilities.getMouseCoordinates(event)

      for (const ship of this.ships) {
        if (Utilities.checkCollisionPointToRect(mousePosition, ship)) {
          this.currentShip = ship
          const { x, y } = this.currentShip

          if (!this.shipsStartPositions.has(this.currentShip.id)) {
            this.shipsStartPositions.set(this.currentShip.id, new Point(x, y))
          }
          this.offset.setPosition(event.clientX - x, event.clientY - y)
        }
      }
    }
  }

  private setMouseMove(): void {
    this.field.mouseMove = event => {
      if (this.currentShip) {
        const x = event.clientX - this.offset.x
        const y = event.clientY - this.offset.y
        this.currentShip.setPosition(x, y)
        this.field.setCursor('grab')
        this.redrawShips()
      }
    }
  }

  private setMouseUp(): void {
    this.field.mouseUp = () => {
      if (this.currentShip) {
        const { x, y, w, h } = this.currentShip
        if (
          Utilities.isRectInsideRect({ x, y, w, h }, { x: 0, y: 0, w: Config.size, h: Config.size })
        ) {
          this.putShip(this.currentShip)
        } else {
          this.moveToStartPosition(this.currentShip.id)
        }
        this.currentShip = null
        this.field.setCursor('default')
      }
    }
  }

  private putShip(ship: Ship): void {
    const size = Config.cellSize
    const iX = Utilities.div(ship.x, size)
    const iY = Utilities.div(ship.y, size)

    if (this.gridPositions[iY][iX] !== 0) {
      this.moveToStartPosition(ship.id)
      return
    }

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      ship.orientation === Orientation.H ? (x += i) : (y += i)
      this.gridPositions[y][x] = 1
    }

    ship.setPosition(iX * size + 2, iY * size + 2)
    this.redrawShips()
  }

  private moveToStartPosition(id: string): void {
    if (this.currentShip && id) {
      const aShip = this.shipsStartPositions.get(id)
      if (aShip) {
        const { x, y } = aShip
        this.currentShip.setPosition(x, y)
        this.redrawShips()
      }
    }
  }

  private redrawShips(): void {
    this.field.clear()
    this.drawShips()
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw())
  }
}
