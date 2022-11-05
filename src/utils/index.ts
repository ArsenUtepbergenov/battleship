import { IRect, IPoint } from '@/models'

export default class Utilities {
  public static getMouseCoordinates(event: MouseEvent): { x: number; y: number } {
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  public static rectPointCollision(point: IPoint, rect: IRect): boolean {
    if (
      point.x > rect.x &&
      point.x < rect.x + rect.w &&
      point.y > rect.y &&
      point.y < rect.y + rect.h
    ) {
      return true
    }

    return false
  }
}
