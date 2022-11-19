import { CanvasNode, MouseEventHandler } from '@/models'
import { IRect } from '@/models/types'

export default class Canvas {
  private width = 0
  private height = 0
  private context: CanvasRenderingContext2D
  private instance: HTMLCanvasElement

  constructor({ id, width, height, outlineColor }: CanvasNode) {
    this.instance = document.createElement('canvas')
    this.context = this.instance.getContext('2d')!

    this.init({ id, width, height, outlineColor })
  }

  public appendTo(parentNode: string): void {
    try {
      const parent = document.getElementById(parentNode)

      if (parent) {
        parent.appendChild(this.instance)
      } else {
        throw new Error(`Can't find the '${parentNode}' node`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  private init({ id, width, height, outlineColor = '' }: CanvasNode): void {
    try {
      id && this.instance.setAttribute('id', id)
      this.setSize(width, height)
      this.instance.style.outlineColor = outlineColor
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

  public set mouseDown(fn: MouseEventHandler) {
    this.instance.onmousedown = fn
  }

  public set mouseMove(fn: MouseEventHandler) {
    this.instance.onmousemove = fn
  }

  public set mouseUp(fn: MouseEventHandler) {
    this.instance.onmouseup = fn
  }

  public set mouseOut(fn: MouseEventHandler) {
    this.instance.onmouseout = fn
  }

  public set click(fn: MouseEventHandler) {
    this.instance.onclick = fn
  }

  public set contextMenu(fn: MouseEventHandler) {
    this.instance.oncontextmenu = fn
  }
}
