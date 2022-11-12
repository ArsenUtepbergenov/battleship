import Canvas from '@/components/Canvas'
import { FightFieldParams } from '@/models'
import BackgroundGrid from './BackgroundGrid'

export default class FightField {
  private instance: Canvas = new Canvas(FightFieldParams)
  private backgroundGrid = new BackgroundGrid()

  constructor() {
    this.backgroundGrid.appendTo('fight-field')
    this.backgroundGrid.draw()
    this.instance.appendTo('fight-field')
  }
}
