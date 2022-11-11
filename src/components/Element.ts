import { ElementConfig, EventHandler } from '@/models'

export default abstract class Element {
  protected instance: HTMLElement

  constructor(nameElement: string) {
    this.instance = document.createElement(nameElement)
  }

  protected init({ parentElement, id }: ElementConfig): void {
    try {
      const parent = document.getElementById(parentElement)

      if (parent) {
        id && this.instance.setAttribute('id', `${parentElement}-${id}`)
        parent.appendChild(this.instance)
      } else {
        throw new Error(`Can't find the '${parentElement}' element`)
      }
    } catch (error) {
      console.error(error)
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
