import Element from '../Element'
import GameController from '@/entities/GameController'
import { ButtonNode } from '@/models'
import { GameState } from '@/models/enums'
import { IButton, ISubject } from '@/models/types'

export default class Button extends Element<HTMLButtonElement> implements IButton {
  constructor({ id, classList, text, startIcon }: ButtonNode) {
    super('button')
    this.init({ id, classList, text, startIcon })
  }

  protected init({ id, classList, text = '', startIcon }: ButtonNode): void {
    try {
      super.init({ id, classList })
      this.instance.innerHTML = text
      if (startIcon) this.addStartIcon(startIcon)
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

  private addStartIcon(icon: HTMLElement): void {
    this.instance.prepend(icon)
  }
}
