import { GameState } from '@/models'

export interface Observer {
  update(subject: Subject): void
}

export interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(): void
}

export default class Controller implements Subject {
  public state: GameState = GameState.START
  private observers: Observer[] = []

  public attach(observer: Observer): void {
    try {
      const isExist = this.observers.includes(observer)

      if (isExist) throw new Error('Observer has been attached already')

      this.observers.push(observer)
    } catch (error) {
      console.error(error)
    }
  }

  public detach(observer: Observer): void {
    try {
      const observerIndex = this.observers.indexOf(observer)

      if (observerIndex === -1) throw new Error('Nonexistent observer')

      this.observers.splice(observerIndex, 1)
    } catch (error) {
      console.error(error)
    }
  }

  public notify(): void {
    this.observers.forEach(o => o.update(this))
  }

  public changeStateOfGame(state: GameState): void {
    this.state = state
    this.notify()
  }
}
