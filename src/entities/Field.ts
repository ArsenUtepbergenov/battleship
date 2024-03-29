import Utils from '@/utils'
import Point from './Point'
import Drawer from './Drawer'
import Canvas from '@/components/Canvas'
import BackgroundGrid from './BackgroundGrid'
import GameController from '@/entities/GameController'
import { Ship } from '@/entities/Ship'
import { GameState } from '@/models/enums'
import { IField, IPoint, ISubject } from '@/models/types'
import { Directions, FieldParams, FieldRect, getDefaultGrid } from '@/models'
import { Config } from '@/config'
import gameService from '@/services/game-service'
import socketService from '@/services/socket-service'
import Renderer from './Renderer'

export default class Field implements IField {
  readonly canvas = new Canvas(FieldParams)
  private drawer = new Drawer(this.canvas.ctx)
  private renderer = new Renderer(this.drawer)
  private backgroundGrid = new BackgroundGrid('field')
  private ships: Ship[] = []
  private shipsStartPositions: Map<string, Point> = new Map()
  private currentShip: Ship | null = null
  private offset = new Point()
  private grid = getDefaultGrid()
  private shipsOnField: Ship[] = []
  private areAllShipsOnField = false
  private numberLiveShipCells = 0

  constructor() {
    this.backgroundGrid.draw()
    this.canvas.appendTo('field')
  }

  private getCoordinates(ship: Ship): IPoint {
    if (Math.random() < 0.5) ship.toggleOrientation()
    let maxX = 9
    let maxY = 9
    const offset = Config.cells - ship.size

    ship.isHorizontal ? (maxX = offset) : (maxY = offset)
    const iX = Utils.randomIntByInterval(0, maxX)
    const iY = Utils.randomIntByInterval(0, maxY)

    return { x: iX, y: iY }
  }

  public putShipsToRandom(): void {
    this.reset()

    if (!this.ships?.length) return
    let i = this.ships.length

    while (i > 0) {
      const ship = this.ships[i - 1]

      const { x: iX, y: iY } = this.getCoordinates(ship)

      if (!this.occupyCellsByShip(ship, iX, iY)) continue

      if (!this.shipsStartPositions.has(ship.id))
        this.shipsStartPositions.set(ship.id, new Point(ship.x, ship.y))

      for (let i = 0; i < ship.size; i++) {
        let x = iX,
          y = iY
        ship.isHorizontal ? (x += i) : (y += i)

        this.occupyCellsAroundShip({ x, y })
      }

      this.setPositionOfShip(ship, { x: iX * Config.cellSize + 2, y: iY * Config.cellSize + 2 })
      this.shipsOnField.push(ship)
      i--
    }

    this.areAllShipsOnField = this.shipsOnField.length === Config.numberShips
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
    this.numberLiveShipCells = Config.numberShipCells
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
    this.grid = getDefaultGrid()
    this.shipsOnField.forEach(ship => this.moveToStartPosition(ship))
    this.shipsOnField = []
    this.shipsStartPositions.clear()
    this.offset = new Point()
    this.areAllShipsOnField = false
    this.redrawShips()
    this.numberLiveShipCells = Config.numberShipCells
  }

  public setShips(ships: Ship[]): void {
    this.ships = ships
    this.drawShips()
  }

  public undo(): void {
    if (!this.shipsOnField?.length) return

    const lastShip = this.shipsOnField.pop()
    if (!lastShip) return

    this.resetCurrentShip()
    this.removeShipFromField(lastShip)
    this.moveToStartPosition(lastShip)
    this.shipsStartPositions.delete(lastShip.id)
    this.areAllShipsOnField = false
    this.offset = new Point()
  }

  public shoot({ x, y }: IPoint): void {
    if (!socketService.socket) return
    let isHit = false

    if (this.grid[y][x] === 1) {
      this.grid[y][x] = 2
      this.renderer.drawHit({ x, y })
      isHit = true
      this.numberLiveShipCells--
    } else {
      this.grid[y][x] = -2
      this.renderer.drawMiss({ x, y })
    }

    gameService.hit(socketService.socket, isHit)
    if (this.numberLiveShipCells <= 0) gameService.stopGame(socketService.socket)
  }

  public setHandlers(): void {
    this.setMouseMove()
    this.setMouseOut()
    this.setClick()
    this.setContextMenu()
  }

  public unsetHandlers(): void {
    this.canvas.mouseMove = null
    this.canvas.mouseOut = null
    this.canvas.click = null
    this.canvas.contextMenu = null
  }

  private setCursor(cursor?: string): void {
    this.canvas.setCursor(cursor)
  }

  private removeShipFromField(ship: Ship): void {
    const iX = Utils.div(ship.x, Config.cellSize)
    const iY = Utils.div(ship.y, Config.cellSize)

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      ship.isHorizontal ? (x += i) : (y += i)

      this.grid[y][x] = 0
      if (!this.occupyCellsAroundShip({ x, y }, -1, 0)) return
    }

    this.shipsOnField.forEach(ship => {
      const iX = Utils.div(ship.x, Config.cellSize)
      const iY = Utils.div(ship.y, Config.cellSize)

      for (let i = 0; i < ship.size; i++) {
        let x = iX,
          y = iY
        ship.isHorizontal ? (x += i) : (y += i)

        if (!this.occupyCellsAroundShip({ x, y })) return
      }
    })
  }

  private isOnField(ship: Ship): boolean {
    return this.shipsOnField.find(s => s.id === ship.id) ? true : false
  }

  private showPointerCursorOverShip(position: IPoint): void {
    for (const ship of this.ships) {
      if (Utils.checkCollisionPointToRect(position, ship) && !this.isOnField(ship)) {
        this.setCursor('pointer')
        break
      } else {
        this.setCursor()
      }
    }
  }

  private setMouseMove(): void {
    this.canvas.mouseMove = event => {
      this.showPointerCursorOverShip(Utils.getMouseCoordinates(event))

      if (!this.currentShip) return

      this.currentShip.setPosition({
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y,
      })
      this.setCursor('grab')
      this.redrawShips()
    }
  }

  private setMouseOut(): void {
    this.canvas.mouseOut = () => {
      if (!this.currentShip) return

      this.moveToStartPosition(this.currentShip)
      this.resetCurrentShip()
    }
  }

  private setClick(): void {
    this.canvas.click = event => {
      Utils.removeDefaultAction(event)

      const position = Utils.getMouseCoordinates(event)
      const client = new Point(event.clientX, event.clientY)

      !this.currentShip ? this.setCurrentShip(position, client) : this.putCurrentShip()
    }
  }

  private setContextMenu(): void {
    this.canvas.contextMenu = event => {
      Utils.removeDefaultAction(event)
      if (!this.currentShip) return

      this.currentShip.toggleOrientation()
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

        this.offset.set(client.x - x, client.y - y)
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

  private occupyCellsByShip(ship: Ship, iX: number, iY: number): boolean {
    const isH = ship.isHorizontal

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

    if (!this.occupyCellsByShip(ship, iX, iY)) return

    for (let i = 0; i < ship.size; i++) {
      let x = iX,
        y = iY
      ship.isHorizontal ? (x += i) : (y += i)

      if (!this.occupyCellsAroundShip({ x, y })) return
    }

    this.setPositionOfShip(ship, { x: iX * size + 2, y: iY * size + 2 })
    this.shipsOnField.push(ship)
    this.areAllShipsOnField = this.shipsOnField.length === Config.numberShips
  }

  private occupyCellsAroundShip({ x, y }: IPoint, from: number = 0, to: number = -1): boolean {
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

  private setPositionOfShip(ship: Ship, { x, y }: IPoint): void {
    ship.setPosition({ x, y })
    this.redrawShips()
    this.resetCurrentShip()
  }

  private moveToStartPosition(ship: Ship): void {
    if (!ship.id) return

    const p = this.shipsStartPositions.get(ship.id)
    if (!p) return

    if (!ship.isHorizontal) ship.toggleOrientation()

    ship.setPosition({ x: p.x, y: p.y })
    this.redrawShips()
  }

  private resetCurrentShip(): void {
    this.currentShip = null
    this.setCursor()
  }

  private redrawShips(): void {
    this.canvas.clear()
    this.drawShips()
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw(this.canvas.ctx))
  }
}
