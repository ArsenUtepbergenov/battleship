import Utils from '@/utils'
import Canvas from '@/components/Canvas'
import BackgroundGrid from './BackgroundGrid'
import GameController from '@/entities/GameController'
import { IObserver, IPoint, ISubject } from '@/models/types'
import { Config, FieldRect, FightFieldParams } from '@/models'
import { GameState } from '@/models/enums'

export default class FightField implements IObserver {
  private instance: Canvas = new Canvas(FightFieldParams)
  private backgroundGrid = new BackgroundGrid('fight-field')
  private shottedCells: number[][] = Utils.getDefaultGrid()

  constructor() {
    this.backgroundGrid.draw()
    this.instance.appendTo('fight-field')
  }

  public update(subject: ISubject): void {
    const isController = subject instanceof GameController

    if (!isController) return

    switch (subject.state) {
      case GameState.PLAY:
        this.instance.setCursor('pointer')
        this.setHandlers()
        break
      case GameState.START:
        this.instance.setCursor()
        this.unsetHandlers()
        break
      case GameState.OVER:
        this.reset()
        break
    }
  }

  public reset(): void {
    this.instance.clear()
    this.shottedCells = Utils.getDefaultGrid()
    this.unsetHandlers()
    this.instance.setCursor()
  }

  //TODO: is or are ?
  public isAllCellsShotted(): boolean {
    let result = true

    this.shottedCells.forEach(row => {
      if (row.some(el => el === 0)) result = false
    })

    return result
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
    if (this.shottedCells[y][x] === 1) return

    this.shottedCells[y][x] = 1

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
