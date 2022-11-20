import { Messages, NotificationNode } from '@/models'
import { ColorType } from '@/models/enums'
import Notification from '@/components/notifications/Notification'

export default class Notifications {
  public static parentNode = 'notifications'
  private static size = 0
  private static lifeTime = 2500
  private static notifications: Notification[] = []

  public static create({ text = '', type = ColorType.DEFAULT, lifeTime }: NotificationNode): void {
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

const notifications = {
  PlayerSurrendered: () =>
    Notifications.create({
      text: Messages.PlayerSurrendered,
      type: ColorType.SUCCESS,
      lifeTime: 3500,
    }),
  GameIsOver: () =>
    Notifications.create({
      text: Messages.GameIsOver,
      type: ColorType.ERROR,
      lifeTime: 4500,
    }),
  PlayerPlaying: () =>
    Notifications.create({
      text: Messages.PlayerPlaying,
      type: ColorType.INFO,
      lifeTime: 3500,
    }),
  TwoPlayersInRoom: () =>
    Notifications.create({
      text: Messages.TwoPlayersInRoom,
      type: ColorType.INFO,
      lifeTime: 3500,
    }),
  NotAllShipsOnField: () =>
    Notifications.create({
      text: Messages.NotAllShipsOnField,
      type: ColorType.ERROR,
    }),
  NoTwoPlayersInRoom: () =>
    Notifications.create({
      text: Messages.NoTwoPlayersInRoom,
      type: ColorType.ERROR,
    }),
  PlayerIsNotReady: () =>
    Notifications.create({
      text: Messages.PlayerIsNotReady,
      type: ColorType.ERROR,
    }),
}

export function notify(message: string) {
  notifications[message as keyof typeof notifications]()
}
