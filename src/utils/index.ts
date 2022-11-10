import { IRect, IPoint } from '@/models'

export default class Utilities {
  public static div(numerator: number, denominator: number): number {
    return (numerator - (numerator % denominator)) / denominator
  }

  public static createMatrix(width: number, height: number): number[][] {
    const matrix: number[][] = []
    while (height--) {
      matrix.push(new Array(width).fill(0))
    }
    return matrix
  }

  public static getMouseCoordinates(event: MouseEvent): IPoint {
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  public static checkCollisionPointToRect(point: IPoint, rect: IRect): boolean {
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

  public static checkCollisionRectToRect(firstRect: IRect, secondRect: IRect): boolean {
    if (
      firstRect.x < secondRect.x + secondRect.w &&
      firstRect.x + firstRect.w > secondRect.x &&
      firstRect.y < secondRect.y + secondRect.h &&
      firstRect.y + firstRect.h > secondRect.y
    ) {
      return true
    }

    return false
  }

  /**
   * The method checks if the 'iRect' is inside the 'eRect'
   * @param iRect an internal rectangle
   * @param eRect an external rectangle
   */
  public static isRectInsideRect(iRect: IRect, eRect: IRect): boolean {
    if (
      iRect.x >= eRect.x &&
      iRect.x + iRect.w <= eRect.x + eRect.w &&
      iRect.y >= eRect.y &&
      iRect.y + iRect.h <= eRect.y + eRect.h
    ) {
      return true
    }

    return false
  }

  public static removeDefaultAction(event: MouseEvent): void {
    event.preventDefault()
    event.stopPropagation()
  }
}
