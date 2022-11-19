import { Config, TypeShips } from '@/config'
import { ShipParams } from '@/models'
import { Orientation } from '@/models/enums'
import { IRect } from '@/models/types'

function createShip({ x, y, type, id }: ShipParams): Ship {
  return new Ship({ x, y, size: type, id })
}

export function createShips(): Ship[] {
  const ships: Ship[] = []
  const size = Config.shipSize

  const startX = Config.size + Config.halfCellSize

  const offsetX = size + 2
  const offsetY = size * 2

  for (const [i, ship] of TypeShips.entries()) {
    const { amount, type } = ship
    const y = offsetY * i + size

    for (let n = 0; n < amount; n++) {
      const x = startX + n * (offsetX * (i + 1))

      ships.push(createShip({ x, y, type, id: `${i}${n}` }))
    }
  }

  return ships
}

export class Ship implements IRect {
  public x: number
  public y: number
  public w: number
  public h: number
  public size: number
  public orientation = Orientation.Horizontal
  private _id: string = ''

  constructor({ x = 0, y = 0, size = 1, id = '' }) {
    this.x = x
    this.y = y
    this.size = size
    this.w = Config.shipSize * this.size - 4
    this.h = Config.shipSize - 4
    this._id = id
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Config.shipColor
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.w, this.h)
    ctx.fill()
  }

  public toggleOrientation(): void {
    this.isHorizontal
      ? (this.orientation = Orientation.Vertical)
      : (this.orientation = Orientation.Horizontal)
    ;[this.w, this.h] = [this.h, this.w]
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  public get id(): string {
    return this._id
  }

  public get isHorizontal(): boolean {
    return this.orientation === Orientation.Horizontal
  }
}
