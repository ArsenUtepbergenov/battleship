import { Config, IRect, ShipParams, Ships, TypeShips } from '@/models'

export function createShips(ctx: CanvasRenderingContext2D): Ship[] {
  const ships: Ship[] = []

  const dx = Config.shipSize + 10
  const startX = Config.size + 20
  const dy = Config.shipSize * 2

  for (const [i, ship] of TypeShips.entries()) {
    const { amount, type } = ship
    const y = Config.shipSize + dy * i

    for (let n = 0; n < amount; n++) {
      const x = startX + n * (dx * (i + 1))

      ships.push(createShip(ctx, { x, y, type }))
    }
  }

  return ships
}

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

export class Ship implements IRect {
  public x: number = 0
  public y: number = 0
  public w: number
  public h: number = Config.shipSize
  private c: CanvasRenderingContext2D
  private size: number = 1

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
    c.beginPath()
    c.rect(this.x, this.y, this.w, this.h)
    c.fill()
  }

  public setPosition(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}
