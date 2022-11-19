import Utils from '@/utils'
import Canvas from '@/components/Canvas'
import BackgroundGrid from './BackgroundGrid'
import GameController from '@/entities/GameController'
import { IObserver, IPoint, ISubject } from '@/models/types'
import { FieldRect, FightFieldParams } from '@/models'
import { GameState } from '@/models/enums'
import Drawer from './Drawer'
import { Config } from '@/config'
import socketService from '@/services/socket-service'
import gameService from '@/services/game-service'

export default class FightField implements IObserver {
  private instance = new Canvas(FightFieldParams)
  private drawer = new Drawer(this.instance.ctx)
  private backgroundGrid = new BackgroundGrid('fight-field')
  private shottedCells = Utils.getDefaultGrid()

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

  public areAllCellsShotted(): boolean {
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
    if (!socketService.socket) return
    if (this.shottedCells[y][x] === 1) return

    if (!gameService.isPlayerTurn) {
      this.shottedCells[y][x] = 1
      gameService.updateGame(socketService.socket, { x, y })
      this.drawShot({ x, y })
      gameService.isPlayerTurn = true
    }
  }

  private drawShot({ x, y }: IPoint): void {
    this.drawer.fillCircle({
      position: {
        x: x * Config.cellSize + Config.halfCellSize,
        y: y * Config.cellSize + Config.halfCellSize,
      },
      radius: 10,
      color: Config.successShotColor,
    })
  }
}
