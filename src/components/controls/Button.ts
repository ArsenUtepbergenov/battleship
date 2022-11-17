import Element from '../Element'
import GameController from '@/entities/GameController'
import { ButtonNode } from '@/models'
import { GameState } from '@/models/enums'
import { IObserver, ISubject } from '@/models/types'

export default class Button extends Element implements IObserver {
  constructor({ id, classList, text }: ButtonNode) {
    super('button')
    this.init({ id, classList, text })
  }

  protected init({ id, classList, text = '' }: ButtonNode): void {
    try {
      super.init({ id, classList })
      this.instance.innerHTML = text
    } catch (error) {
      console.error(error)
    }
  }

  public update(subject: ISubject): void {
    const isController = subject instanceof GameController

    if (!isController) return

    switch (subject.state) {
      case GameState.PLAY:
        this.disable()
        break
      case GameState.START:
      case GameState.OVER:
        this.undisable()
        break
    }
  }
}
