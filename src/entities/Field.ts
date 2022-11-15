import { FieldRect } from './../models/index'
import Canvas from '@/components/Canvas'
import { Ship } from '@/entities/Ship'
import { Config, Directions, FieldParams } from '@/models'
import { GameState, Orientation } from '@/models/enums'
import { IObserver, IPoint, ISubject } from '@/models/types'
import Utils from '@/utils'
import BackgroundGrid from './BackgroundGrid'
import Point from './Point'
import GameController from '@/entities/GameController'

export default class Field implements IObserver {
  private instance: Canvas = new Canvas(FieldParams)
  private backgroundGrid = new BackgroundGrid('field')
  private ships: Ship[] = []
  private shipsStartPositions: Map<string, Point> = new Map()
  private currentShip: Ship | null = null
  private offset = new Point()
  private grid: number[][] = Utils.getDefaultGrid()
  private shipsOnField: Ship[] = []
  private areAllShipsOnField: boolean = false

  constructor() {
    this.backgroundGrid.draw()
    this.instance.appendTo('field')
  }

  public update(subject: ISubject): void {
    const isController = subject instanceof GameController

    if (!isController) return

    switch (subject.state) {
      case GameState.START:
        this.setHandlers()
        break
      case GameState.PLAY:
        this.freeze()
        break
      case GameState.OVER:
        this.unfreeze()
        break
    }
  }

  public freeze(): void {
    if (!this.isReady) return

    this.unsetHandlers()
  }

  public unfreeze(): void {
    this.reset()
    this.setHandlers()
  }

  public get isReady(): boolean {
    return this.areAllShipsOnField
  }

  public reset(): void {
    this.resetCurrentShip()
    this.grid = Utils.getDefaultGrid()
    this.shipsOnField.forEach(ship => this.moveToStartPosition(ship))
    this.shipsOnField = []
    this.shipsStartPositions.clear()
    this.offset = new Point()
    this.areAllShipsOnField = false
    this.redrawShips()
  }

  public setShips(ships: Ship[]): void {
    this.ships = ships
    this.drawShips()
  }

  public undo(): void {
    if (this.shipsOnField.length) {
      const lastShip = this.shipsOnField.pop()

      if (lastShip) {
        this.resetCurrentShip()
        this.removeShipFromField(lastShip)
        this.moveToStartPosition(lastShip)
        this.shipsStartPositions.delete(lastShip.id)
        this.offset = new Point()
      }
    }
  }

  private removeShipFromField(ship: Ship): void {
    const iX = Utils.div(ship.x, Config.cellSize)
    const iY = Utils.div(ship.y, Config.cellSize)
    const isH = ship.orientation === Orientation.H

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      isH ? (x += i) : (y += i)

      this.grid[y][x] = 0
      if (!this.occupyAroundShip(y, x, -1, 0)) return
    }

    this.shipsOnField.forEach(ship => {
      const iX = Utils.div(ship.x, Config.cellSize)
      const iY = Utils.div(ship.y, Config.cellSize)
      const isH = ship.orientation === Orientation.H

      for (let i = 0; i < ship.size; i++) {
        let x = iX,
          y = iY
        isH ? (x += i) : (y += i)

        if (!this.occupyAroundShip(y, x)) return
      }
    })
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

  private isOnField(ship: Ship): boolean {
    return this.shipsOnField.find(s => s.id === ship.id) ? true : false
  }

  private showPointerCursorOverShip(position: IPoint): void {
    for (const ship of this.ships) {
      if (Utils.checkCollisionPointToRect(position, ship) && !this.isOnField(ship)) {
        this.instance.setCursor('pointer')
        break
      } else {
        this.instance.setCursor()
      }
    }
  }

  private setMouseMove(): void {
    this.instance.mouseMove = event => {
      this.showPointerCursorOverShip(Utils.getMouseCoordinates(event))

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

  private setClick(): void {
    this.instance.click = event => {
      Utils.removeDefaultAction(event)

      const position = Utils.getMouseCoordinates(event)
      const client = new Point(event.clientX, event.clientY)

      !this.currentShip ? this.setCurrentShip(position, client) : this.putCurrentShip()
    }
  }

  private setContextMenu(): void {
    this.instance.contextMenu = event => {
      Utils.removeDefaultAction(event)
      if (!this.currentShip) return

      this.currentShip.changeOrientation()
      this.redrawShips()
    }
  }

  private setCurrentShip(position: IPoint, client: IPoint): void {
    for (const ship of this.ships) {
      if (Utils.checkCollisionPointToRect(position, ship)) {
        if (this.isOnField(ship)) return

        const { x, y } = (this.currentShip = ship)

        if (!this.shipsStartPositions.has(this.currentShip.id))
          this.shipsStartPositions.set(this.currentShip.id, new Point(x, y))

        this.offset.setPosition(client.x - x, client.y - y)
      }
    }
  }

  private putCurrentShip(): void {
    if (!this.currentShip) return

    if (Utils.isRectInsideRect(this.currentShip, FieldRect)) {
      this.putShip(this.currentShip)
    }
  }

  private checkIntervalX(start: number, end: number, axis: number): boolean {
    while (start < end) {
      if (this.grid[axis][start] !== 0) return false
      start++
    }

    return true
  }

  private checkIntervalY(start: number, end: number, axis: number): boolean {
    while (start < end) {
      if (this.grid[start][axis] !== 0) return false
      start++
    }

    return true
  }

  private occupyShip(ship: Ship, iX: number, iY: number): boolean {
    const isH = ship.orientation === Orientation.H

    if (isH) {
      if (!this.checkIntervalX(iX, iX + ship.size, iY)) return false
    } else {
      if (!this.checkIntervalY(iY, iY + ship.size, iX)) return false
    }

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      isH ? (x += i) : (y += i)
      this.grid[y][x] = 1
    }

    return true
  }

  private putShip(ship: Ship): void {
    const size = Config.cellSize
    const iX = Utils.div(ship.x, size)
    const iY = Utils.div(ship.y, size)

    if (!this.occupyShip(ship, iX, iY)) return

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      ship.orientation === Orientation.H ? (x += i) : (y += i)

      if (!this.occupyAroundShip(y, x)) return
    }

    this.setPositionOfShip(ship, iX * size + 2, iY * size + 2)
    this.shipsOnField.push(ship)
    this.areAllShipsOnField = this.shipsOnField.length === Config.numberShips
  }

  private occupyAroundShip(y: number, x: number, from: number = 0, to: number = -1): boolean {
    try {
      for (const { c, r } of Directions) {
        const dx = x + c
        const dy = y + r
        const grid = this.grid
        const boundX = dx > grid.length - 1 || dx < 0
        const boundY = dy > grid.length - 1 || dy < 0

        if (boundX || boundY) continue
        if (grid[dy][dx] === from) this.grid[dy][dx] = to
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
    this.instance.setCursor()
  }

  private redrawShips(): void {
    this.instance.clear()
    this.drawShips()
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw(this.instance.ctx))
  }
}
