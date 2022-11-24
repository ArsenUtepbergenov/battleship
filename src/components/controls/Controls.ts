import { MouseEventHandler } from '@/models'
import { IButton } from '@/models/types'
import Dom from '@/utils/dom'
import Button from './Button'

const icon = Dom.create('i', { classList: ['fas', 'fa-sm', 'icon'] })
const playIcon = Dom.clone(icon, { classList: ['fa-gamepad'] })
const resetIcon = Dom.clone(icon, { classList: ['fa-sync'] })
const undoIcon = Dom.clone(icon, { classList: ['fa-redo'] })
const randomIcon = Dom.clone(icon, { classList: ['fa-redo'] })

const mapButtons: Map<string, IButton> = new Map([
  ['play', new Button({ id: 'play-button', text: 'play', startIcon: playIcon })],
  ['reset', new Button({ id: 'reset-button', text: 'reset', startIcon: resetIcon })],
  ['undo', new Button({ id: 'undo-button', text: 'undo', startIcon: undoIcon })],
  ['random', new Button({ id: 'random-button', text: 'random', startIcon: randomIcon })],
])

class Buttons {
  private map: Map<string, IButton>

  constructor(buttons: Map<string, IButton>) {
    this.map = buttons
  }

  public setClick(callbacks: MouseEventHandler[]): void {
    const bs = Array.from(this.map)
    callbacks?.length && callbacks.forEach((c, i) => (bs[i][1].click = c))
  }

  public unsetClick(): void {
    this.map.forEach(b => (b.click = null))
  }

  public append(to: string): void {
    this.map.forEach(b => b.appendTo(to))
  }

  public get(id: string): IButton {
    return this.map.get(id)!
  }

  public get getAll(): Map<string, IButton> {
    return this.map
  }
}

export default new Buttons(mapButtons)
