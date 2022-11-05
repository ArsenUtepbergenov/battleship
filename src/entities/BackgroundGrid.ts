import { Config } from '@/models'
import Canvas from './Canvas'

export default class BackgroundGrid {
  private bgCanvas: Canvas
  private c: CanvasRenderingContext2D | null = null

  constructor() {
    this.bgCanvas = new Canvas()
    this.bgCanvas.init({
      parentElement: 'field',
      id: 'grid',
      width: Config.size,
      height: Config.size,
    })
    this.c = this.bgCanvas.ctx
  }

  public draw(): void {
    const c = this.c
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
