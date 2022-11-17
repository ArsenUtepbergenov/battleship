import Element from '../Element'
import { TextInputNode } from '@/models'

export default class TextInput extends Element {
  constructor({ id, classList, value, placeholder }: TextInputNode) {
    super('input')
    this.init({ id, classList, value, placeholder })
  }

  protected init({ id, classList, value = '', placeholder = '' }: TextInputNode): void {
    try {
      super.init({ id, classList })
      this.instance.setAttribute('type', 'text')
      this.instance.setAttribute('value', value)
      this.instance.setAttribute('placeholder', placeholder)
    } catch (error) {
      console.error(error)
    }
  }
}
