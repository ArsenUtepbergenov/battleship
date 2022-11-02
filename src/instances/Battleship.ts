import Canvas from '@/entities/Canvas'
import { createShip, Ship } from '@/entities/Ship'
import { Ships, Config } from '@/models'

export default class Battleship {
  private staticField: Canvas
  private field: Canvas
  private sCtx: CanvasRenderingContext2D | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private settingsShips = [{ number: 4, type: Ships.TorpedoBoat }]
  private ships: Ship[] = []

  constructor() {
    this.staticField = new Canvas()
    this.staticField.init({
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

    this.sCtx = this.staticField.ctx
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

    for (const ship of this.settingsShips) {
      for (let s = 1; s <= ship.number; s++) {
        const tempS = createShip(c, ship.type)
        this.ships.push(tempS)
      }
    }
  }

  private drawShips(): void {
    const h = 40
    const step = 50
    let i = 0

    for (const s of this.ships) {
      s.draw(Config.size + 40 + step * i, h)
      i++
    }
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

  private get rect(): DOMRect {
    return this.staticField.domRect
  }
}
