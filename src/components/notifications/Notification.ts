import Element from '../Element'
import { NotificationNode } from '@/models'
import { NotificationType } from '@/models/enums'

export default class Notification extends Element {
  constructor({ text, type }: NotificationNode) {
    super('span')
    this.init({ text, type })
  }

  protected init({
    text = '',
    defaultClassList = ['notification'],
    type = NotificationType.DEFAULT,
  }: NotificationNode): void {
    try {
      super.init({ defaultClassList })
      this.instance.innerHTML = text

      switch (type) {
        case NotificationType.ERROR:
          this.setClassList(['notification--error'])
          break
      }
    } catch (error) {
      console.error(error)
    }
  }
}
