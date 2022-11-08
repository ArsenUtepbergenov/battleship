import { Config, IRect, Orientation, ShipParams, TypeShips } from '@/models'

export function createShips(ctx: CanvasRenderingContext2D): Ship[] {
  const ships: Ship[] = []
  const size = Config.shipSize

  const startX = Config.size + size / 2

  const offsetX = size + 12
  const offsetY = 80

  for (const [i, ship] of TypeShips.entries()) {
    const { amount, type } = ship
    const y = offsetY * i + size

    for (let n = 0; n < amount; n++) {
      const x = startX + n * (offsetX * (i + 1))

      ships.push(createShip(ctx, { x, y, type, id: `${i}${n}` }))
    }
  }

  return ships
}

export function createShip(ctx: CanvasRenderingContext2D, { x, y, type, id }: ShipParams): Ship {
  return new Ship(ctx, { x, y, size: type, id })
}

export class Ship implements IRect {
  public x: number
  public y: number
  public w: number
  public h: number
  public size: number
  public orientation: Orientation = Orientation.H
  private _id: string = ''
  private c: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D, { x = 0, y = 0, size = 1, id = '' }) {
    this.x = x
    this.y = y
    this.c = ctx
    this.size = size
    this.w = Config.shipSize * this.size - 4
    this.h = Config.shipSize - 4
    this._id = id
  }

  public draw(): void {
    const c = this.c
    if (!c) return

    c.fillStyle = Config.shipColor
    c.beginPath()
    c.rect(this.x, this.y, this.w, this.h)
    c.fill()
  }

  public changeOrientation(): void {
    if (this.orientation === Orientation.H) this.orientation = Orientation.V
    else if (this.orientation === Orientation.V) this.orientation = Orientation.H
    ;[this.w, this.h] = [this.h, this.w]
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  public get id(): string {
    return this._id
  }
}
