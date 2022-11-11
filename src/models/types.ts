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
