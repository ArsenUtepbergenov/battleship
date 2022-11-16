import { GameState } from '@/models/enums'
import { IObserver, ISubject } from '@/models/types'

export default class GameController implements ISubject {
  public state: GameState = GameState.START
  private observers: IObserver[] = []

  public attach(observer: IObserver): void {
    try {
      const isExist = this.observers.includes(observer)

      if (isExist) throw new Error('IObserver has been attached already')

      this.observers.push(observer)
    } catch (error) {
      console.error(error)
    }
  }

  public detach(observer: IObserver): void {
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

  public setState(state: GameState): void {
    this.state = state
    this.notify()
  }
}
