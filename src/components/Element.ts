import { Node, MouseEventHandler, EventHandler } from '@/models'

export default abstract class Element<InstanceType extends HTMLElement> {
  protected instance: InstanceType

  constructor(nameElement: string) {
    this.instance = document.createElement(nameElement) as InstanceType
  }

  protected init({ id, classList }: Node): void {
    if (id) {
      const tid = id.trim()
      this.instance.setAttribute('id', tid)
    }
    classList?.length && this.setClassList(classList)
  }

  public appendTo(parentNode: string): void {
    try {
      const parent = document.getElementById(parentNode)

      if (parent) {
        parent.appendChild(this.instance)
      } else {
        throw new Error(`Can't find the '${parentNode}' node`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  public removeFrom(parentNode: string): void {
    try {
      const parent = document.getElementById(parentNode)

      if (parent) {
        parent.removeChild(this.instance)
      } else {
        throw new Error(`Can't find the '${parentNode}' node`)
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

  public set input(fn: EventHandler) {
    this.instance.oninput = fn
  }

  public set change(fn: EventHandler) {
    this.instance.onchange = fn
  }

  public set click(fn: MouseEventHandler) {
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
