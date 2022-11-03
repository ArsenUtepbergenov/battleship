import { Config, ShipParams, Ships } from '@/models'

export function createShip(ctx: CanvasRenderingContext2D, { x, y, type }: ShipParams): Ship {
  switch (type) {
    case Ships.TorpedoBoat:
      return new Ship(ctx, { x, y, deckSize: 1 })
    case Ships.Destroyer:
      return new Ship(ctx, { x, y, deckSize: 2 })
    case Ships.Cruiser:
      return new Ship(ctx, { x, y, deckSize: 3 })
    case Ships.Battleship:
      return new Ship(ctx, { x, y, deckSize: 4 })
    default:
      return new Ship(ctx, { x: 0, y: 0, deckSize: 1 })
  }
}

export class Ship {
  private x: number = 0
  private y: number = 0
  private c: CanvasRenderingContext2D
  private size: number = 1
  private w: number
  private h: number = Config.shipSize

  constructor(ctx: CanvasRenderingContext2D, { x = 0, y = 0, deckSize = 1 }) {
    this.x = x
    this.y = y
    this.c = ctx
    this.size = deckSize
    this.w = Config.shipSize * this.size
  }

  public draw(): void {
    const c = this.c
    if (!c) return

    c.fillStyle = Config.shipColor
    c.fillRect(this.x, this.y, this.w, this.h)
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
