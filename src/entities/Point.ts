import { IPoint } from '@/models'

export default class Point implements IPoint {
  public x: number = 0
  public y: number = 0

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  public setPosition(x: number = 0, y: number = 0): void {
    this.x = x
    this.y = y
  }
}
