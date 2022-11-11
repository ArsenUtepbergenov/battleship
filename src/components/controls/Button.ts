import Controller, { Observer, Subject } from '@/entities/Controller'
import { ButtonConfig, EventHandler, GameState } from '@/models'

export default class Button implements Observer {
  private instance: HTMLButtonElement

  constructor({ parentElement, id, text }: ButtonConfig) {
    this.instance = document.createElement('button')

    this.init({ parentElement, id, text })
  }

  private init({ parentElement = 'controls', id, text = '' }: ButtonConfig): void {
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

  public update(subject: Subject): void {
    if (subject instanceof Controller && subject.state === GameState.PLAY) {
      this.disable()
    }
  }

  public disable(): void {
    this.setAttribute('disabled', '')
  }

  public undisable(): void {
    this.removeAttribute('disabled')
  }

  public set click(fn: EventHandler) {
    this.instance.onclick = fn
  }

  public setClassList(classes: string[]): void {
    this.instance.classList.add(...classes)
  }

  public setAttribute(qualifiedName: string, value: string): void {
    this.instance.setAttribute(qualifiedName, value)
  }

  public removeAttribute(qualifiedName: string): void {
    this.instance.removeAttribute(qualifiedName)
  }
}
