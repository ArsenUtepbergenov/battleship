import { IPoint } from '@/models/types'
import Canvas from '@/components/Canvas'
import { Config, FieldRect, FightFieldParams } from '@/models'
import Utils from '@/utils'
import BackgroundGrid from './BackgroundGrid'

export default class FightField {
  private instance: Canvas = new Canvas(FightFieldParams)
  private backgroundGrid = new BackgroundGrid()
  private shottedPositions: number[][] = Utils.getDefaultGrid()

  constructor() {
    this.backgroundGrid.appendTo('fight-field')
    this.backgroundGrid.draw()
    this.instance.appendTo('fight-field')
    this.instance.setCursor('pointer')
    this.setHandlers()
  }

  public reset(): void {
    this.instance.clear()
    this.shottedPositions = Utils.getDefaultGrid()
  }

  private setHandlers(): void {
    this.setClick()
  }

  private unsetHandlers(): void {
    this.instance.click = null
  }

  private setClick(): void {
    this.instance.click = event => {
      Utils.removeDefaultAction(event)

      const position = Utils.getMouseCoordinates(event)
      const iX = Utils.div(position.x, Config.cellSize)
      const iY = Utils.div(position.y, Config.cellSize)

      if (!Utils.checkCollisionPointToRect(position, FieldRect)) return

      this.shoot({ x: iX, y: iY })
    }
  }

  private shoot({ x, y }: IPoint): void {
    if (this.shottedPositions[y][x] === 1) return

    this.shottedPositions[y][x] = 1

    this.drawShot({ x, y })
  }

  private drawShot({ x, y }: IPoint): void {
    const ctx = this.instance.ctx
    const _x = x * Config.cellSize + Config.cellSize / 2
    const _y = y * Config.cellSize + Config.cellSize / 2

    ctx.fillStyle = Config.successShotColor
    ctx.beginPath()
    ctx.arc(_x, _y, 10, 0, 2 * Math.PI)
    ctx.fill()
  }
}
