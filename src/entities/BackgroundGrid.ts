import Canvas from '@/components/Canvas'
import { BackgroundGridParams, Config } from '@/models'

export default class BackgroundGrid {
  private canvas: Canvas
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = new Canvas(BackgroundGridParams)
    this.ctx = this.canvas.ctx
  }

  public appendTo(parentNode: string): void {
    this.canvas.appendTo(parentNode)
  }

  public draw(): void {
    const c = this.ctx

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
