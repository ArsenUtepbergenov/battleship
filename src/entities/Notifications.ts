import { NotificationNode } from '@/models'
import { NotificationType } from '@/models/enums'
import Notification from '@/components/notifications/Notification'

export default class Notifications {
  public static parentNode = 'notifications-container'
  private static size = 0
  private static lifeTime = 2500
  private static notifications: Notification[] = []

  public static create({
    text = '',
    type = NotificationType.DEFAULT,
    lifeTime,
  }: NotificationNode): void {
    const notification = new Notification({ text, type })
    notification.appendTo(Notifications.parentNode)
    Notifications.notifications.push(notification)
    Notifications.size++

    setTimeout(this.delete, lifeTime || Notifications.lifeTime)
  }

  private static delete(): void {
    if (!Notifications.size) return

    const notification = Notifications.notifications.shift()
    notification?.removeFrom(Notifications.parentNode)
    Notifications.size--
  }
}
