import { MouseEventHandler } from '.'

export interface IObserver {
  update(subject: ISubject): void
}

export interface ISubject {
  attach(observer: IObserver): void
  detach(observer: IObserver): void
  notify(): void
}

export interface IRect {
  x: number
  y: number
  w: number
  h: number
}

export interface IPoint {
  x: number
  y: number
}

export interface IFillCircle {
  position: IPoint
  radius: number
  color?: string
}

export interface IFillRect extends IRect {
  color?: string
}

export interface IStrokeCross extends IPoint {
  offset: number
  color?: string
}

export interface IButton extends IObserver {
  click: MouseEventHandler
  appendTo(parentNode: string): void
}
