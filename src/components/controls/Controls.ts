import Button from './Button'

export const Controls: Map<string, Button> = new Map([
  ['play', new Button({ id: 'play-button', text: 'play' })],
  ['reset', new Button({ id: 'reset-button', text: 'reset' })],
  ['undo', new Button({ id: 'undo-button', text: 'undo' })],
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
