import { CanvasConfig } from 'models'

export default class Canvas {
  private context: CanvasRenderingContext2D | null = null
  private instance: HTMLCanvasElement

  constructor() {
    this.instance = document.createElement('canvas')
    this.context = this.instance.getContext('2d')
  }

  public init({ parent, width, height }: CanvasConfig): void {
    try {
      const field = document.getElementById(parent)

      if (field) {
        field.appendChild(this.instance)
        this.setSize(width, height)
      } else {
        throw new Error(`Can't find the '${parent}' element`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  public setSize(width: number = 0, height: number = 0): void {
    this.instance.width = width
    this.instance.height = height
  }

  public get ctx(): CanvasRenderingContext2D | null {
    return this.context
  }
}
