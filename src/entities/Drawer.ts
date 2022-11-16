import { IFillCircle, IFillRect } from '@/models/types'

export default class Drawer {
  private c: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.c = ctx
  }

  public fillCircle({ position: { x, y }, radius, color = 'black' }: IFillCircle): void {
    this.c.fillStyle = color
    this.c.beginPath()
    this.c.arc(x, y, radius, 0, 2 * Math.PI)
    this.c.fill()
  }

  public fillRect({ x, y, w, h, color = 'black' }: IFillRect): void {
    this.c.fillStyle = color
    this.c.beginPath()
    this.c.rect(x, y, w, h)
    this.c.fill()
  }
}
