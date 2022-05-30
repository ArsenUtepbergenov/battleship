import Canvas from '@/entities/Canvas'

export default class Battleship {
  private canvas: Canvas

  constructor() {
    this.canvas = new Canvas()
    this.canvas.init({
      parent: 'field',
      width: Config.size,
      height: Config.size,
    })
  }

  public draw(): void {
    if (!this.canvas.ctx) return

    this.drawGrid()
  }

  private drawGrid(): void {
    if (!this.canvas.ctx) return

    const ctx = this.canvas.ctx

    ctx.lineWidth = 2
    ctx.strokeStyle = Config.gridColor

    for (let x = 1; x < Config.cells; x++) {
      ctx.beginPath()
      ctx.moveTo(x * Config.cellSize, 0)
      ctx.lineTo(x * Config.cellSize, Config.cellSize * Config.cells)
      ctx.stroke()
    }

    for (let y = 1; y < Config.cells; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * Config.cellSize)
      ctx.lineTo(Config.cellSize * Config.cells, y * Config.cellSize)
      ctx.stroke()
    }
  }
}

abstract class Config {
  static size = 400
  static cells = 10
  static cellSize = Math.floor(Config.size / Config.cells)
  static gridColor = '#3c813f'
}
