import { ButtonConfig, EventHandlerParams } from '@/models'

export default class Button {
  private instance: HTMLButtonElement

  constructor({ parentElement, id, text }: ButtonConfig) {
    this.instance = document.createElement('button')

    this.init({ parentElement, id, text })
  }

  private init({ parentElement, id, text = '' }: ButtonConfig): void {
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

  public setClassList(classes: string[]): void {
    this.instance.classList.add(...classes)
  }

  public setAttribute(qualifiedName: string, value: string): void {
    this.instance.setAttribute(qualifiedName, value)
  }
}
