import Dom from '@/utils/dom'
import Button from './Button'

const icon = Dom.create('i', { classList: ['fas', 'fa-sm', 'icon'] })
const playIcon = Dom.clone(icon, { classList: ['fa-gamepad'] })
const resetIcon = Dom.clone(icon, { classList: ['fa-sync'] })
const undoIcon = Dom.clone(icon, { classList: ['fa-redo'] })

export const Controls: Map<string, Button> = new Map([
  ['play', new Button({ id: 'play-button', text: 'play', startIcon: playIcon })],
  ['reset', new Button({ id: 'reset-button', text: 'reset', startIcon: resetIcon })],
  ['undo', new Button({ id: 'undo-button', text: 'undo', startIcon: undoIcon })],
])

export function unsetControls(): void {
  Controls.forEach(c => (c.click = null))
}

export function appendControls(to: string): void {
  Controls.forEach(c => c.appendTo(to))
}

export function getControl(id: string): Button {
  return Controls.get(id)!
}
