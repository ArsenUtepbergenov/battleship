import Canvas from '@/components/Canvas'
import { Config } from '@/config'
import { BackgroundGridParams } from '@/models'

export default class BackgroundGrid {
  private canvas: Canvas

  constructor(parentNode?: string) {
    this.canvas = new Canvas(BackgroundGridParams)
    parentNode && this.appendTo(parentNode)
  }

  public appendTo(parentNode: string): void {
    this.canvas.appendTo(parentNode)
  }

  public draw(): void {
    const c = this.canvas.ctx
    const cells = Config.cells

    c.lineWidth = 2
    c.strokeStyle = Config.gridColor

    for (let x = 1; x < cells; x++) {
      c.beginPath()
      c.moveTo(x * Config.cellSize, 0)
      c.lineTo(x * Config.cellSize, Config.size)
      c.stroke()
    }

    for (let y = 1; y < cells; y++) {
      c.beginPath()
      c.moveTo(0, y * Config.cellSize)
      c.lineTo(Config.size, y * Config.cellSize)
      c.stroke()
    }
  }
}
