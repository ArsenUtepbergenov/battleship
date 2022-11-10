import { Ship } from '@/entities/Ship'
import { Config, Directions, FieldParams, IPoint, Orientation } from '@/models'
import Utilities from '@/utils'
import Canvas from './Canvas'
import Point from './Point'

// default constants
const defaultGridField = Utilities.createMatrix(Config.gridPositionsSize, Config.gridPositionsSize)

export default class Field {
  private instance: Canvas
  private ships: Ship[] = []
  private shipsStartPositions: Map<string, Point> = new Map()
  private currentShip: Ship | null = null
  private offset = new Point()
  private gridPositions: number[][]
  private activeShipsOnField: Ship[] = []

  constructor() {
    this.instance = new Canvas(FieldParams)
    this.gridPositions = defaultGridField
    this.setHandlers()
  }

  public clear(): void {
    this.resetCurrentShip()
    this.gridPositions = defaultGridField

    this.activeShipsOnField.forEach(ship => this.moveToStartPosition(ship))

    this.redrawShips()
    this.unsetHandlers()
  }

  public putShips(ships: Ship[]): void {
    this.ships = ships
    this.drawShips()
  }

  private setHandlers(): void {
    this.setMouseMove()
    this.setMouseOut()
    this.setClick()
    this.setContextMenu()
  }

  private unsetHandlers(): void {
    this.instance.mouseMove = null
    this.instance.mouseOut = null
    this.instance.click = null
    this.instance.contextMenu = null
  }

  private removeDefaultAction(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
  }

  private setMouseMove(): void {
    this.instance.mouseMove = event => {
      if (!this.currentShip) return

      const x = event.clientX - this.offset.x
      const y = event.clientY - this.offset.y
      this.currentShip.setPosition(x, y)
      this.instance.setCursor('grab')
      this.redrawShips()
    }
  }

  private setMouseOut(): void {
    this.instance.mouseOut = () => {
      if (!this.currentShip) return

      this.moveToStartPosition(this.currentShip)
      this.resetCurrentShip()
    }
  }

  public setClick(): void {
    this.instance.click = event => {
      this.removeDefaultAction(event)

      const position = Utilities.getMouseCoordinates(event)
      const client = new Point(event.clientX, event.clientY)

      !this.currentShip ? this.setCurrentShip(position, client) : this.putCurrentShip()
    }
  }

  private setContextMenu(): void {
    this.instance.contextMenu = event => {
      this.removeDefaultAction(event)
      if (!this.currentShip) return

      this.currentShip.changeOrientation()
      this.redrawShips()
    }
  }

  private setCurrentShip(position: IPoint, client: IPoint): void {
    for (const ship of this.ships) {
      if (Utilities.checkCollisionPointToRect(position, ship)) {
        this.currentShip = ship
        const { x, y } = this.currentShip

        if (!this.shipsStartPositions.has(this.currentShip.id))
          this.shipsStartPositions.set(this.currentShip.id, new Point(x, y))

        this.offset.setPosition(client.x - x, client.y - y)
      }
    }
  }

  private putCurrentShip(): void {
    if (!this.currentShip) return

    const sizeField = { x: 0, y: 0, w: Config.size, h: Config.size }

    if (Utilities.isRectInsideRect(this.currentShip, sizeField)) {
      this.putShip(this.currentShip)
    }

    return
  }

  private checkX(grid: number[][], s: number, e: number, a: number): boolean {
    while (s < e) {
      if (grid[a][s] !== 0) return false
      s++
    }

    return true
  }

  private checkY(grid: number[][], s: number, e: number, a: number): boolean {
    while (s < e) {
      if (grid[s][a] !== 0) return false
      s++
    }

    return true
  }

  private occupyShip(ship: Ship, iX: number, iY: number): boolean {
    const isH = ship.orientation === Orientation.H

    if (isH) {
      if (!this.checkX(this.gridPositions, iX, iX + ship.size, iY)) return false
    } else {
      if (!this.checkY(this.gridPositions, iY, iY + ship.size, iX)) return false
    }

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      isH ? (x += i) : (y += i)
      this.gridPositions[y][x] = 1
    }

    return true
  }

  private putShip(ship: Ship): void {
    const size = Config.cellSize
    const iX = Utilities.div(ship.x, size)
    const iY = Utilities.div(ship.y, size)
    const isH = ship.orientation === Orientation.H

    if (!this.occupyShip(ship, iX, iY)) return

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      isH ? (x += i) : (y += i)

      if (!this.occupyAroundShip(y, x)) return
    }

    this.setPositionOfShip(ship, iX * size + 2, iY * size + 2)

    this.activeShipsOnField.push(ship)
  }

  private occupyAroundShip(y: number, x: number): boolean {
    try {
      for (const { c, r } of Directions) {
        const dx = x + c
        const dy = y + r
        const grid = this.gridPositions
        const boundX = dx > grid.length - 1 || dx < 0
        const boundY = dy > grid.length - 1 || dy < 0

        if (boundX || boundY) continue
        if (grid[dy][dx] === 1) continue
        if (grid[dy][dx] === 0) this.gridPositions[dy][dx] = -1
      }

      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  private setPositionOfShip(ship: Ship, x: number, y: number): void {
    ship.setPosition(x, y)
    this.redrawShips()
    this.resetCurrentShip()
  }

  private moveToStartPosition(ship: Ship): void {
    if (ship?.id) {
      const currentShipStartPosition = this.shipsStartPositions.get(ship.id)

      if (!currentShipStartPosition) return

      const { x, y } = currentShipStartPosition

      if (ship.orientation === Orientation.V) ship.changeOrientation()

      ship.setPosition(x, y)
      this.redrawShips()
    }
  }

  private resetCurrentShip(): void {
    this.currentShip = null
    this.instance.setCursor('default')
  }

  private redrawShips(): void {
    this.instance.clear()
    this.drawShips()
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw(this.instance.ctx))
  }
}
