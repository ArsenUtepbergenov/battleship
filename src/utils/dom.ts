import { Node } from '@/models'

export default abstract class Dom {
  public static create(tagName: string, { id, classList = [] }: Node): HTMLElement {
    const element = document.createElement(tagName)
    id && element.setAttribute('id', id)
    element.classList.add(...classList)
    return element
  }

  public static clone(node: HTMLElement, { classList = [] }: Node): HTMLElement {
    const newNode = node.cloneNode() as HTMLElement
    newNode.classList.add(...classList)
    return newNode
  }
}
