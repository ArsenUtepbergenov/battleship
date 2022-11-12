import Controller from '@/entities/GameController'
import { ButtonNode } from '@/models'
import { GameState } from '@/models/enums'
import { IObserver, ISubject } from '@/models/types'
import Element from '../Element'

export default class Button extends Element implements IObserver {
  constructor({ id, defaultClassList, text }: ButtonNode) {
    super('button')
    this.init({ id, defaultClassList, text })
  }

  protected init({ id, defaultClassList, text = '' }: ButtonNode): void {
    try {
      super.init({ id, defaultClassList })
      this.instance.innerHTML = text
    } catch (error) {
      console.error(error)
    }
  }

  public update(subject: ISubject): void {
    if (subject instanceof Controller && subject.state === GameState.PLAY) {
      this.disable()
    }
  }
}
