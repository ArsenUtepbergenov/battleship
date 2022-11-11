import { IRect, CanvasConfig, EventHandler } from '@/models'

export default class Canvas {
  private width = 0
  private height = 0
  private context: CanvasRenderingContext2D
  private instance: HTMLCanvasElement

  constructor({ parentElement, id, width, height }: CanvasConfig) {
    this.instance = document.createElement('canvas')
    this.context = this.instance.getContext('2d')!

    this.init({ parentElement, id, width, height })
  }

  private init({ parentElement, id, width, height }: CanvasConfig): void {
    try {
      const parent = document.getElementById(parentElement)

      if (parent) {
        id && this.instance.setAttribute('id', `${parentElement}-${id}`)
        parent.appendChild(this.instance)
        this.setSize(width, height)
      } else {
        throw new Error(`Can't find the '${parentElement}' element`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  public setCursor(cursor: string = 'default'): void {
    this.instance.style.cursor = cursor
  }

  public setSize(width: number = 0, height: number = 0): void {
    this.width = this.instance.width = width
    this.height = this.instance.height = height
  }

  public clear(rect: IRect = { x: 0, y: 0, w: this.width, h: this.height }): void {
    this.context.clearRect(rect.x, rect.y, rect.w, rect.h)
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.context
  }

  public get domRect(): DOMRect {
    return this.instance.getBoundingClientRect()
  }

  public set mouseDown(fn: EventHandler) {
    this.instance.onmousedown = fn
  }

  public set mouseMove(fn: EventHandler) {
    this.instance.onmousemove = fn
  }

  public set mouseUp(fn: EventHandler) {
    this.instance.onmouseup = fn
  }

  public set mouseOut(fn: EventHandler) {
    this.instance.onmouseout = fn
  }

  public set click(fn: EventHandler) {
    this.instance.onclick = fn
  }

  public set contextMenu(fn: EventHandler) {
    this.instance.oncontextmenu = fn
  }
}
