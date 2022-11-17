export default class Dom {
  public static create(
    tagName: string,
    { id = '', classList }: { id?: string; classList?: string[] },
  ): HTMLElement {
    const element = document.createElement(tagName)
    element.setAttribute('id', id)
    classList?.length && element.classList.add(...classList)
    return element
  }
}
