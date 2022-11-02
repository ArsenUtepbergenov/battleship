import { Config, Ships } from '@/models'

export function createShip(ctx: CanvasRenderingContext2D, type: Ships): Ship {
  switch (type) {
    case Ships.TorpedoBoat:
      return new Ship(ctx, 1)
    default:
      return new Ship(ctx, 1)
  }
}

export class Ship {
  private c: CanvasRenderingContext2D
  private size: number = 1
  private w: number
  private h: number = Config.shipSize

  constructor(ctx: CanvasRenderingContext2D, deckSize: number = 1) {
    this.c = ctx
    this.size = deckSize
    this.w = Config.shipSize * this.size
  }

  public draw(x: number, y: number): void {
    const c = this.c
    if (!c) return

    c.fillStyle = Config.shipColor
    c.fillRect(x, y, this.w, this.h)
  }
}
