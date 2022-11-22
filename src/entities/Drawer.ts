import { IFillCircle, IFillRect, IStrokeCross } from '@/models/types'

export default class Drawer {
  private c: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.c = ctx
  }

  public fillCircle({ position: { x, y }, radius, color = 'black' }: IFillCircle): void {
    const c = this.c

    c.fillStyle = color
    c.beginPath()
    c.arc(x, y, radius, 0, 2 * Math.PI)
    c.fill()
  }

  public fillRect({ x, y, w, h, color = 'black' }: IFillRect): void {
    const c = this.c

    c.fillStyle = color
    c.beginPath()
    c.rect(x, y, w, h)
    c.fill()
  }

  public drawCross({ x, y, offset, color = 'black' }: IStrokeCross): void {
    const c = this.c

    c.strokeStyle = color
    c.lineWidth = 2
    c.beginPath()
    c.moveTo(x - offset, y - offset)
    c.lineTo(x + offset, y + offset)
    c.stroke()
    c.beginPath()
    c.moveTo(x + offset, y - offset)
    c.lineTo(x - offset, y + offset)
    c.stroke()
  }
}
