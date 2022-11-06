import { CanvasConfig } from '@/models'

export default class Canvas {
  private width = 0
  private height = 0
  private context: CanvasRenderingContext2D
  private instance: HTMLCanvasElement

  constructor() {
    this.instance = document.createElement('canvas')
    this.context = this.instance.getContext('2d')!
  }

  public init({ parentElement, id, width, height }: CanvasConfig): void {
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

  public clear(
    x: number = 0,
    y: number = 0,
    w: number = this.width,
    h: number = this.height,
  ): void {
    this.context.clearRect(x, y, w, h)
  }

  public get ctx(): CanvasRenderingContext2D {
    return this.context
  }

  public get domRect(): DOMRect {
    return this.instance.getBoundingClientRect()
  }

  public set mouseDown(fn: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    this.instance.onmousedown = fn
  }

  public set mouseMove(fn: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    this.instance.onmousemove = fn
  }

  public set mouseUp(fn: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    this.instance.onmouseup = fn
  }

  public set mouseOut(fn: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    this.instance.onmouseout = fn
  }
}
