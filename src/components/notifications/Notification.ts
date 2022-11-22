import Element from '../Element'
import { NotificationNode } from '@/models'
import { ColorType } from '@/models/enums'

export default class Notification extends Element<HTMLSpanElement> {
  constructor({ text, type }: NotificationNode) {
    super('span')
    this.init({ text, type })
  }

  protected init({
    text = '',
    classList = ['notification'],
    type = ColorType.DEFAULT,
  }: NotificationNode): void {
    try {
      super.init({ classList })
      this.instance.innerHTML = text

      switch (type) {
        case ColorType.ERROR:
          this.setClassList(['notification--error'])
          break
        case ColorType.SUCCESS:
          this.setClassList(['notification--success'])
          break
        case ColorType.INFO:
          this.setClassList(['notification--info'])
          break
      }
    } catch (error) {
      console.error(error)
    }
  }
}
