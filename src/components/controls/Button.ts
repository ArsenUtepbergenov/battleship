import { ButtonConfig, EventHandlerParams } from '@/models'

export default class Button {
  private instance: HTMLButtonElement

  constructor({ parentElement, id, width, height, text }: ButtonConfig) {
    this.instance = document.createElement('button')

    this.init({ parentElement, id, width, height, text })
  }

  private init({ parentElement, id, width, height, text = '' }: ButtonConfig): void {
    try {
      const parent = document.getElementById(parentElement)

      if (parent) {
        id && this.instance.setAttribute('id', `${parentElement}-${id}`)
        this.instance.innerHTML = text
        parent.appendChild(this.instance)
      } else {
        throw new Error(`Can't find the '${parentElement}' element`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  public set click(fn: EventHandlerParams) {
    this.instance.onclick = fn
  }
}