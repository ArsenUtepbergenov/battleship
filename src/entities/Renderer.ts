import Drawer from './Drawer'
import { Config } from '@/config'
import { IPoint } from '@/models/types'

export default class Renderer {
  private drawer: Drawer

  constructor(drawer: Drawer) {
    this.drawer = drawer
  }

  public drawHit({ x, y }: IPoint): void {
    this.drawer.drawCross({
      x: x * Config.cellSize + Config.halfCellSize,
      y: y * Config.cellSize + Config.halfCellSize,
      offset: Config.cellSize / 3,
      color: Config.failShotColor,
    })
  }

  public drawMiss({ x, y }: IPoint): void {
    this.drawer.fillCircle({
      position: {
        x: x * Config.cellSize + Config.halfCellSize,
        y: y * Config.cellSize + Config.halfCellSize,
      },
      radius: 4,
      color: Config.missedShotColor,
    })
  }

  public drawShot({ x, y }: IPoint, isHit: boolean = false): void {
    this.drawer.fillCircle({
      position: {
        x: x * Config.cellSize + Config.halfCellSize,
        y: y * Config.cellSize + Config.halfCellSize,
      },
      radius: 10,
      color: isHit ? Config.successShotColor : Config.failShotColor,
    })
  }
}
