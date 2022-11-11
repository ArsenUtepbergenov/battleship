import Controller from '@/entities/GameController'
import { ButtonConfig } from '@/models'
import { GameState } from '@/models/enums'
import { IObserver, ISubject } from '@/models/types'
import Element from '../Element'

export default class Button extends Element implements IObserver {
  constructor({ parentElement, id, text }: ButtonConfig) {
    super('button')
    this.init({ parentElement, id, text })
  }

  protected init({ parentElement, id, text = '' }: ButtonConfig): void {
    try {
      super.init({ parentElement, id })
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
