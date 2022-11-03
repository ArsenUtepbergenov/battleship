import Canvas from '@/entities/Canvas'
import { createShip, Ship } from '@/entities/Ship'
import { Ships, Config } from '@/models'

export default class Battleship {
  private bgGrid: Canvas
  private field: Canvas
  private sCtx: CanvasRenderingContext2D | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private settingsShips = [
    { amount: 4, type: Ships.TorpedoBoat },
    { amount: 3, type: Ships.Destroyer },
    { amount: 2, type: Ships.Cruiser },
    { amount: 1, type: Ships.Battleship },
  ]
  private ships: Ship[] = []

  constructor() {
    this.bgGrid = new Canvas()
    this.bgGrid.init({
      parentElement: 'field',
      id: 'grid',
      width: Config.size,
      height: Config.size,
    })

    this.field = new Canvas()
    this.field.init({
      parentElement: 'field',
      id: 'game',
      width: Config.size + Config.shipsSpotSize,
      height: Config.size,
    })

    this.sCtx = this.bgGrid.ctx
    this.ctx = this.field.ctx
  }

  public run(): void {
    if (!this.sCtx || !this.ctx) return

    this.drawGrid()
    this.createShips()
    this.drawShips()
  }

  private createShips(): void {
    const c = this.ctx
    if (!c) return

    const dx = Config.shipSize + 10
    const startX = Config.size + 20
    const dy = Config.shipSize * 2

    for (const [i, ship] of this.settingsShips.entries()) {
      const { amount, type } = ship
      const y = Config.shipSize + dy * i

      for (let n = 0; n < amount; n++) {
        const x = startX + n * (dx * (i + 1))

        this.ships.push(createShip(c, { x, y, type }))
      }
    }
  }

  private drawShips(): void {
    this.ships.forEach(s => s.draw())
  }

  private drawGrid(): void {
    const c = this.sCtx
    if (!c) return

    c.lineWidth = 2
    c.strokeStyle = Config.gridColor

    for (let x = 1; x < Config.cells; x++) {
      c.beginPath()
      c.moveTo(x * Config.cellSize, 0)
      c.lineTo(x * Config.cellSize, Config.cellSize * Config.cells)
      c.stroke()
    }

    for (let y = 1; y < Config.cells; y++) {
      c.beginPath()
      c.moveTo(0, y * Config.cellSize)
      c.lineTo(Config.cellSize * Config.cells, y * Config.cellSize)
      c.stroke()
    }
  }
}
