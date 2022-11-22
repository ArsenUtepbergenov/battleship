import { Socket } from 'socket.io-client'
import Utils from '@/utils'
import Drawer from './Drawer'
import Canvas from '@/components/Canvas'
import BackgroundGrid from './BackgroundGrid'
import gameService from '@/services/game-service'
import socketService from '@/services/socket-service'
import GameController from '@/entities/GameController'
import { Config } from '@/config'
import { GameState } from '@/models/enums'
import { notify } from '@/entities/Notifications'
import { FieldRect, FightFieldParams } from '@/models'
import { IObserver, IPoint, ISubject } from '@/models/types'

export default class FightField implements IObserver {
  private instance = new Canvas(FightFieldParams)
  private drawer = new Drawer(this.instance.ctx)
  private backgroundGrid = new BackgroundGrid('fight-field')
  private shottedCells = Utils.getDefaultGrid()
  private ws: Socket | null
  private currentShot: IPoint | null = null

  constructor() {
    this.backgroundGrid.draw()
    this.instance.appendTo('fight-field')
    this.ws = socketService.socket

    this.handleHit()
  }

  public resetCursor(): void {
    this.instance.setCursor()
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
    this.currentShot = null
  }

  public areAllCellsShotted(): boolean {
    let result = true

    this.shottedCells.forEach(row => {
      if (row.some(el => el === 0)) result = false
    })

    return result
  }

  private handleHit(): void {
    if (!this.ws) return

    gameService.onHit(this.ws, (isHit: boolean) => {
      if (isHit) notify('YouHitOpponent')
      this.drawShot(this.currentShot!, isHit)
    })
  }

  public setHandlers(): void {
    this.setClick()
  }

  public unsetHandlers(): void {
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
    if (!this.ws) return
    if (gameService.playersCanPlay < 2) {
      notify('PlayerIsNotReady')
      return
    }
    if (this.shottedCells[y][x] === 1) return

    if (gameService.movingPlayerId !== this.ws.id) {
      notify('NotYourMove')
    } else {
      this.currentShot = { x, y }
      this.shottedCells[y][x] = 1
      gameService.updateGame(this.ws, { x, y })
    }
  }

  private drawShot({ x, y }: IPoint, isHit: boolean = false): void {
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
