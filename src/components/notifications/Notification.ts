import Element from '../Element'
import { NotificationConfig } from '@/models'

export default class Notification extends Element {
  constructor({ parentElement, id, text }: NotificationConfig) {
    super('span')
    this.init({ parentElement, id, text })
  }

  protected init({ parentElement, id, text = '' }: NotificationConfig): void {
    try {
      super.init({ parentElement, id })
      this.instance.innerHTML = text
    } catch (error) {
      console.error(error)
    }
  }
}
